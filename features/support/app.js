const test = require('tape')

const app = require('../../lib')
const db = require('../../lib/services/database')

function cleanDb () {
  return Promise.all([
    db.table('apps').delete(),
    db.table('users').delete(),
    db.table('permissions').delete(),
    db.table('sessions').delete()
  ])
}

async function start () {
  await cleanDb()
  app.start()
}

async function stop () {
  await cleanDb()
  app.stop()
}

test.onFinish(db.destroy)

module.exports = {
  start,
  stop
}
