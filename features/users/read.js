const test = require('tape')

const httpRequest = require('../_support/httpRequest')
const app = require('../_support/app')

const populateTestUser = require('../_support/populates/populateTestUser')
const populateTestSession = require('../_support/populates/populateTestSession')
const populateTestApp = require('../_support/populates/populateTestApp')
const runFunctionMultipleTimes = require('../_support/runFunctionMultipleTimes')

const url = `http://localhost:${process.env.PORT}/v1`

test('read user - will return unauthorised if missing permission', async function (t) {
  t.plan(2)

  await app.start()

  const myUser = await populateTestUser()
  const mySession = await populateTestSession(myUser)

  const anotherUser = await populateTestUser()

  const response = await httpRequest(`${url}/users/${anotherUser.username}`, {
    json: true,
    validateStatus: () => true,
    headers: mySession.headers
  })

  await app.stop()

  t.equal(response.status, 401, '401 status returned')
  t.deepEqual(response.data, {}, 'nothing is returned')
})

test('read user - will show one user if only one exists', async function (t) {
  t.plan(5)

  await app.start()

  const myUser = await populateTestUser({
    perms: ['sso:app:authorise', 'sso:auth_admin:read']
  })
  const mySession = await populateTestSession(myUser)
  const myApp = await populateTestApp({ owner: myUser, session: mySession })

  const anotherUser = await populateTestUser()

  const response = await httpRequest(`${url}/users/${anotherUser.id}`, {
    json: true,
    headers: mySession.headers
  })

  await app.stop()

  t.equal(response.status, 200, '200 status returned')
  t.ok(response.data.id, 'id is returned')
  t.equal(response.data.username, anotherUser.username, 'username is returned correctly')
  t.equal(response.data.perms.length, 0, 'no perms returnd')
  t.ok(response.data.date_created, 'date_created is returned')
})
