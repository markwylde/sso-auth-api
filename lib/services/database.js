const log = require('./logger')

console.log('setting db to ', process.env['DB_NAME'])
const r = require('rethinkdbdash')({
  db: process.env['DB_NAME'] || 'auth',
  servers: [
    { host: process.env['DB_HOST'], port: process.env['DB_PORT'] || 28015 }
  ],
  silent: true,
  log: (msg) => {
    log.info({ module: 'rethinkdbdash' }, msg)
  }
})

r.destroy = function () {
  r.getPoolMaster().drain()
}

module.exports = r
