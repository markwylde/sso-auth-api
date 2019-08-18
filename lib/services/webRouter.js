const url = require('url')

const bodyParser = require('./bodyParser')

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
            result = await route[2]({
              params: match, query, body, headers
            })
            break
          }
        }
      }
    } catch (error) {
      if (error.code === 422) {
        result = {
          status: 422,
          data: {
            errors: error.message || ['Unprocessable Entity']
          }
        }
      } else if (error.code === 400) {
        result = {
          status: 400,
          data: {
            errors: ['Bad Request, was this JSON?']
          }
        }
      } else if (error.code === 404) {
        result = {
          status: error.code || 404
        }
      } else {
        console.log(error)
        result = {
          status: error.code || 500
        }
      }
    }

    res.setHeader('Content-Type', 'application/json')
    res.writeHead(result.status || 200, { 'Content-Type': 'application/json' })
    res.write(JSON.stringify(result.data || {}))
    res.end()
  }
}

module.exports = webRouter
