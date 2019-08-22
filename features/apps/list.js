const test = require('tape')

const httpRequest = require('../support/httpRequest')
const app = require('../support/app')

const setupTestUserWithSession = require('../support/setupTestUserWithSession')
const setupTestApps = require('../support/setupTestApps')

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

  const sessionHeaders = await setupTestUserWithSession({
    permissions: ['sso:app:authorise']
  })

  await setupTestApps(1, { headers: sessionHeaders, activate: true })
  await setupTestApps(5)

  const response = await httpRequest(`${url}/apps`, { json: true, headers: sessionHeaders })

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
  t.equal(response.data[0].title, 'testtitle1', 'title returned correctly')
  t.equal(response.data[0].active, true, 'active returned correctly')
})

test('list app - will show multiple own apps', async function (t) {
  t.plan(3)

  await app.start()

  const sessionHeaders = await setupTestUserWithSession({
    permissions: ['sso:app:authorise']
  })

  await setupTestApps(2, { headers: sessionHeaders, activate: true })
  await setupTestApps(5)

  const response = await httpRequest(`${url}/apps`, { json: true, headers: sessionHeaders })

  await app.stop()

  t.equal(response.status, 200, '200 status returned')
  t.equal(response.data.length, 2, '2 apps returned')
  t.equal(Object.keys(response.data[0]).length, 6, 'six fields returned')
})

test('list app - will show all apps to admins', async function (t) {
  t.plan(2)

  await app.start()

  const sessionHeaders = await setupTestUserWithSession({
    permissions: ['sso:auth_admin:read', 'sso:auth_admin:update']
  })

  await setupTestApps(1, { headers: sessionHeaders, activate: true, prefix: 'authed' })
  await setupTestApps(5)

  const response = await httpRequest(`${url}/apps`, { json: true, headers: sessionHeaders })

  await app.stop()

  t.equal(response.status, 200, '200 status returned')
  t.equal(response.data.length, 6, '6 apps returned')
})
