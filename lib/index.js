const http = require('http')

const webRouter = require('./services/webRouter')
const log = require('./services/logger')
const db = require('./services/database')

const routes = require('./routes')
const router = webRouter(routes)

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
        // // RethinkDB can't close all connections so
        // // the process hangs. Will be solved when
        // // we move away from rethinkdb.
        // await db.destroy()
        resolve()
      })
    })
  }
}
