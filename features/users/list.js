const test = require('tape')

const httpRequest = require('../_support/httpRequest')
const app = require('../_support/app')

const populateTestUser = require('../_support/populates/populateTestUser')
const populateTestSession = require('../_support/populates/populateTestSession')
const populateTestApp = require('../_support/populates/populateTestApp')
const runFunctionMultipleTimes = require('../_support/runFunctionMultipleTimes')

const url = `http://localhost:${process.env.PORT}/v1`

test('list user - will return unauthorised if missing permission', async function (t) {
  t.plan(2)

  await app.start()

  const myUser = await populateTestUser()
  const mySession = await populateTestSession(myUser)

  const response = await httpRequest(`${url}/users`, {
    json: true,
    validateStatus: () => true,
    headers: mySession.headers
  })

  await app.stop()

  t.equal(response.status, 401, '401 status returned')
  t.deepEqual(response.data, {}, 'nothing is returned')
})

test('list user - will show one user if only one exists', async function (t) {
  t.plan(2)

  await app.start()

  const myUser = await populateTestUser({
    perms: ['sso:app:authorise', 'sso:auth_admin:read']
  })
  const mySession = await populateTestSession(myUser)
  const myApp = await populateTestApp({ owner: myUser, session: mySession })

  const response = await httpRequest(`${url}/users`, {
    json: true,
    headers: mySession.headers
  })

  await app.stop()

  t.equal(response.status, 200, '200 status returned')
  t.equal(response.data.length, 1, 'one user is returned')
})

test('list user - will show five users', async function (t) {
  t.plan(2)

  await app.start()

  runFunctionMultipleTimes(4, () => {
    return populateTestUser()
  })

  const myUser = await populateTestUser({
    perms: ['sso:app:authorise', 'sso:auth_admin:read']
  })
  const mySession = await populateTestSession(myUser)
  await populateTestApp({ owner: myUser, session: mySession })

  const response = await httpRequest(`${url}/users`, { json: true, headers: mySession.headers })

  await app.stop()

  t.equal(response.status, 200, '200 status returned')
  t.equal(response.data.length, 5, 'five users are returned')
})

test('list user - item has the correct properties', async function (t) {
  t.plan(6)

  await app.start()

  const myUser = await populateTestUser({
    perms: ['sso:app:authorise', 'sso:auth_admin:read']
  })
  const mySession = await populateTestSession(myUser)
  await populateTestApp({ owner: myUser, session: mySession })

  const response = await httpRequest(`${url}/users`, {
    json: true,
    headers: mySession.headers
  })

  await app.stop()

  t.equal(response.status, 200, '200 status returned')
  t.ok(response.data[0].id, 'id exists')
  t.ok(response.data[0].username, 'username exists')
  t.notOk(response.data[0].password, 'password does not exist')
  t.ok(response.data[0].perms, 'perms exists')
  t.ok(response.data[0].date_created, 'date_created exists')
})
