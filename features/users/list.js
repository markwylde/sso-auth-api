const test = require('tape')

const axios = require('../support/httpRequest')
const app = require('../support/app')
const db = require('../../lib/services/database')

const setupTestUserWithSession = require('../support/setupTestUserWithSession')
const runFunctionMultipleTimes = require('../support/runFunctionMultipleTimes')

const url = `http://localhost:${process.env.PORT}/v1`

async function setupTestUsers (userCount) {
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

test('list user - will return unauthorised if missing permission', async function (t) {
  t.plan(2)

  await app.start()

  const sessionHeaders = await setupTestUserWithSession({
    permissions: []
  })

  const response = await axios(`${url}/users`, {
    json: true,
    validateStatus: () => true,
    headers: sessionHeaders
  })

  await app.stop()

  t.equal(response.status, 401, '401 status returned')
  t.deepEqual(response.data, {}, 'nothing is returned')
})

test('list user - will show one user if only one exists', async function (t) {
  t.plan(2)

  await app.start()

  const sessionHeaders = await setupTestUserWithSession({
    permissions: ['sso:auth_admin:read']
  })

  const response = await axios(`${url}/users`, { json: true, headers: sessionHeaders })

  await app.stop()

  t.equal(response.status, 200, '200 status returned')
  t.equal(response.data.length, 1, 'no users are returned')
})

test('list user - will show five users', async function (t) {
  t.plan(2)

  await app.start()

  const sessionHeaders = await setupTestUserWithSession({
    permissions: ['sso:auth_admin:read']
  })

  await setupTestUsers(4) // + 1 authorised user to execute the test

  const response = await axios(`${url}/users`, { json: true, headers: sessionHeaders })

  await app.stop()

  t.equal(response.status, 200, '200 status returned')
  t.equal(response.data.length, 5, 'five users are returned')
})

test('list user - item has the correct properties', async function (t) {
  t.plan(6)

  await app.start()

  const sessionHeaders = await setupTestUserWithSession({
    permissions: ['sso:auth_admin:read']
  })

  await setupTestUsers(1)

  const response = await axios(`${url}/users`, { json: true, headers: sessionHeaders })

  await app.stop()

  t.equal(response.status, 200, '200 status returned')
  t.ok(response.data[0].id, 'id exists')
  t.ok(response.data[0].username, 'username exists')
  t.notOk(response.data[0].password, 'password does not exist')
  t.ok(response.data[0].perms, 'perms exists')
  t.ok(response.data[0].date_created, 'date_created exists')
})
