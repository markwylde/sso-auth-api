const http = require('http')

const webRouter = require('./services/webRouter')
const log = require('./services/logger')

require('./services/database')

const routes = require('./routes')
const router = webRouter(routes, { checkRequestedWithHeader: true })

const server = http.createServer(router)

const port = process.env.PORT || 80

module.exports = {
  start: function () {
    server.listen(port)

    log.info(`listening on port ${port}`)
  },

  stop: function () {
    return new Promise((resolve) => {
      server.close(async function () {
        resolve()
      })
    })
  }
}
