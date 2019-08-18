const test = require('tape')
const axios = require('axios')

const app = require('../support/app')
const db = require('../../lib/services/database')

const runFunctionMultipleTimes = require('../support/runFunctionMultipleTimes')

const url = `http://localhost:${process.env.PORT}/v1`

async function setupTestUsers (userCount) {
  await db.table('users').delete()

  return runFunctionMultipleTimes(userCount, num => {
    return db.table('users').insert({
      id: `testuser${num}`,
      username: `testuser${num}`,
      password: `testpass`,
      perms: ['test:test'],
      date_created: new Date()
    })
  })
}

test('list user - will show no users if none exist', async function (t) {
  t.plan(2)

  await app.start()
  await setupTestUsers(0)

  const response = await axios(`${url}/users`, {json: true})

  await app.stop()

  t.equal(response.status, 200, '200 status returned')
  t.equal(response.data.length, 0, 'no users are returned')
})

test('list user - will show five users', async function (t) {
  t.plan(2)

  await app.start()
  await setupTestUsers(5)

  const response = await axios(`${url}/users`, {json: true})

  await app.stop()

  t.equal(response.status, 200, '200 status returned')
  t.equal(response.data.length, 5, 'five users are returned')
})

test('list user - item has the correct properties', async function (t) {
  t.plan(6)

  await app.start()

  await setupTestUsers(1)

  const response = await axios(`${url}/users`, {json: true})

  await app.stop()

  t.equal(response.status, 200, '200 status returned')
  t.ok(response.data[0].id, 'id exists')
  t.ok(response.data[0].username, 'username exists')
  t.notOk(response.data[0].password, 'password does not exist')
  t.ok(response.data[0].perms, 'perms exists')
  t.ok(response.data[0].date_created, 'date_created exists')
})

