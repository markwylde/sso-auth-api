const { Forbidden } = require('generic-errors')

const bodyParser = require('./bodyParser')

function parseCookies (request) {
  const list = {}
  const rc = request.headers.cookie

  rc && rc.split(';').forEach(function (cookie) {
    var parts = cookie.split('=')
    list[parts.shift().trim()] = decodeURI(parts.join('='))
  })

  return list
}

function handleError (error) {
  switch (error.code) {
    case 403:
    case 422:
      return {
        status: error.code,
        data: {
          errors: error.message || ['Unprocessable Entity']
        }
      }

    case 400:
      return {
        status: 400,
        data: {
          errors: ['Bad Request, was this JSON?']
        }
      }

    case 401:
    case 404:
      return {
        status: error.code
      }

    default:
      console.log(error)
      return {
        status: error.code || 500
      }
  }
}

function webRouter (routes, opts = {}) {
  return async function server (req, res) {
    let result = {
      status: 404,
      data: {
        error: 'Not Found'
      }
    }

    try {
      const query = new URL(`https://localhost${req.url}`)
      const body = await bodyParser(req)
      const headers = req.headers
      const cookies = parseCookies(req)

      if (opts.checkRequestedWithHeader) {
        if (!headers['x-requested-with']) {
          throw new Forbidden({
            message: 'No X-Requested-With header provided'
          })
        }
      }

      for (const route of routes) {
        if (route[0] === req.method) {
          const match = route[1].match(req.url)
          if (match) {
            let passableOptions = {
              params: match, query, body, headers, cookies
            }
            const functionChain = route.slice(2)

            for (const fn in functionChain) {
              const currentResult = await functionChain[fn](passableOptions)
              passableOptions = { ...passableOptions, ...currentResult }
            }

            result = passableOptions
            break
          }
        }
      }
    } catch (error) {
      result = handleError(error)
    }

    res.setHeader('Content-Type', 'application/json')
    res.writeHead(result.status || 200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(result.data || {}))
  }
}

module.exports = webRouter
