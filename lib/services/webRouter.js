const url = require('url')

const bodyParser = require('./bodyParser')

function handleError (error) {
  switch (error.code) {
    case 422:
      return {
        status: 422,
        data: {
          errors: error.message || ['Unprocessable Entity']
        }
      }
      break;

    case 400:
      return {
        status: 400,
        data: {
          errors: ['Bad Request, was this JSON?']
        }
      }
      break;

    case 401:
    case 404:
      return {
        status: error.code
      }
      break;
  
    default:
      console.log(error)
      return {
        status: error.code || 500
      }
  }
}

function webRouter (routes) {
  return async function server (req, res) {
    let result = {
      status: 404,
      data: {
        error: 'Not Found'
      }
    }

    try {
      const query = url.parse(req.url, true).query
      const body = await bodyParser(req)
      const headers = req.headers

      for (let route of routes) {
        if (route[0] === req.method) {
          const match = route[1].match(req.url)
          if (match) {
            let passableOptions = {
              params: match, query, body, headers
            }
            const functionChain = route.slice(2)

            for (let fn in functionChain) {
              const currentResult = await functionChain[fn](passableOptions)
              passableOptions = {...passableOptions, ...currentResult}
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
    res.write(JSON.stringify(result.data || {}))
    res.end()
  }
}

module.exports = webRouter
