const test = require('tape')

const httpRequest = require('../_support/httpRequest')
const app = require('../_support/app')

const populateTestUser = require('../_support/populates/populateTestUser')
const populateTestSession = require('../_support/populates/populateTestSession')
const populateTestApp = require('../_support/populates/populateTestApp')

const url = `http://localhost:${process.env.PORT}/v1`

test('list app - will return unauthorised if no session', async function (t) {
  t.plan(2)

  await app.start()

  const response = await httpRequest(`${url}/users`, {
    json: true,
    validateStatus: () => true
  })

  await app.stop()

  t.equal(response.status, 401, '401 status returned')
  t.deepEqual(response.data, {}, 'nothing is returned')
})

test('list app - will show one own app', async function (t) {
  t.plan(11)

  await app.start()

  async function scenario () {
    const myUser = await populateTestUser({
      perms: ['sso:app:authorise']
    })
    const session = await populateTestSession(myUser)
    const app = await populateTestApp({ session })

    return {
      session,
      app
    }
  }

  // Create some scenarios that we don't own
  await scenario()
  await scenario()
  const scenarioInstance = await scenario()

  const response = await httpRequest(`${url}/apps`, {
    json: true, headers: scenarioInstance.session.headers
  })

  await app.stop()

  t.equal(response.status, 200, '200 status returned')
  t.equal(response.data.length, 1, '1 app returned')

  t.equal(Object.keys(response.data[0]).length, 6, 'six fields returned')
  t.ok(response.data[0].date_created, 'date_created existed')
  t.ok(response.data[0].id, 'id returned correctly')
  t.notOk(response.data[0].secret, 'secret is not returned')
  t.notOk(response.data[0].activation_url, 'activation_url is not returned')
  t.ok(response.data[0].user_id, 'user_id is not returned')
  t.ok(response.data[0].date_activated, 'date_activated is not returned')
  t.equal(response.data[0].title, scenarioInstance.app.title, 'title returned correctly')
  t.equal(response.data[0].active, true, 'active returned correctly')
})

test('list app - will show multiple own apps', async function (t) {
  t.plan(3)

  await app.start()

  const myUser = await populateTestUser({
    perms: ['sso:app:authorise']
  })
  const mySession = await populateTestSession(myUser)
  await populateTestApp({ session: mySession })
  await populateTestApp({ session: mySession })

  const response = await httpRequest(`${url}/apps`, {
    json: true, headers: mySession.headers
  })

  await app.stop()

  t.equal(response.status, 200, '200 status returned')
  t.equal(response.data.length, 2, '2 apps returned')
  t.equal(Object.keys(response.data[0]).length, 6, 'six fields returned')
})

test('list app - will show all apps to admins', async function (t) {
  t.plan(2)

  await app.start()

  const myUser = await populateTestUser({
    perms: ['sso:auth_admin:read', 'sso:auth_admin:update']
  })
  const mySession = await populateTestSession(myUser)
  await populateTestApp({ session: mySession })
  await populateTestApp()
  await populateTestApp()

  const response = await httpRequest(`${url}/apps`, {
    json: true, headers: mySession.headers
  })

  await app.stop()

  t.equal(response.status, 200, '200 status returned')
  t.equal(response.data.length, 3, '3 apps returned')
})
