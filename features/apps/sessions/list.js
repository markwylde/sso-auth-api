const test = require('tape')

const httpRequest = require('../../support/httpRequest')
const app = require('../../support/app')

const setupTestUserWithSession = require('../../support/setupTestUserWithSession')
const setupTestApps = require('../../support/setupTestApps')

const url = `http://localhost:${process.env.PORT}/v1`

test('list sessions - will return unauthorised if no user', async function (t) {
  t.plan(2)

  await app.start()

  const sessionHeaders = await setupTestUserWithSession({
    permissions: []
  })

  const apps = await setupTestApps(1, { headers: sessionHeaders, activate: true })
  const appId = apps[0].data.id

  const response = await httpRequest(`${url}/apps/${appId}/sessions`, {
    json: true,
    validateStatus: () => true
  })

  await app.stop()

  t.equal(response.status, 401, '401 status returned')
  t.deepEqual(response.data, {}, 'nothing is returned')
})

test('list sessions - will return unauthorised if wrong user', async function (t) {
  t.plan(2)

  await app.start()

  const sessionHeaders = await setupTestUserWithSession({
    permissions: ['sso:app:authorise']
  })

  const anotherSessionHeaders = await setupTestUserWithSession({
    permissions: []
  })

  const apps = await setupTestApps(1, { headers: sessionHeaders, activate: true })
  const appId = apps[0].data.id

  const response = await httpRequest(`${url}/apps/${appId}/sessions`, {
    json: true,
    validateStatus: () => true,
    headers: anotherSessionHeaders
  })

  await app.stop()

  t.equal(response.status, 401, '401 status returned')
  t.deepEqual(response.data, {}, 'nothing is returned')
})

test('list sessions - will return not found if no app', async function (t) {
  t.plan(2)

  await app.start()

  const sessionHeaders = await setupTestUserWithSession({
    permissions: []
  })

  const response = await httpRequest(`${url}/apps/notreal/sessions`, {
    json: true,
    validateStatus: () => true,
    headers: sessionHeaders
  })

  await app.stop()

  t.equal(response.status, 404, '404 status returned')
  t.deepEqual(response.data, {}, 'nothing is returned')
})

test('list sessions - will return no apps sessions', async function (t) {
  t.plan(2)

  await app.start()

  const sessionHeaders = await setupTestUserWithSession({
    permissions: ['sso:app:authorise']
  })

  const apps = await setupTestApps(1, { headers: sessionHeaders, activate: true })
  const appId = apps[0].data.id

  const response = await httpRequest(`${url}/apps/${appId}/sessions`, {
    json: true,
    validateStatus: () => true,
    headers: sessionHeaders
  })

  await app.stop()

  console.log(response.data)

  t.equal(response.status, 200, '200 status returned')
  t.deepEqual(response.data.length, 0, '0 sessions returned is returned')
})

test('list sessions - will return apps sessions', async function (t) {
  t.plan(6)

  await app.start()

  const sessionHeaders = await setupTestUserWithSession({
    permissions: ['sso:app:authorise']
  })

  const apps = await setupTestApps(1, { headers: sessionHeaders, activate: true })
  const appId = apps[0].data.id
  const appSecret = apps[0].data.secret

  await httpRequest(`${url}/apps/${appId}/sessions`, {
    method: 'post',
    json: true,
    validateStatus: () => true,
    headers: {
      'X-App-Secret': appSecret,
      ...sessionHeaders
    }
  })

  const response = await httpRequest(`${url}/apps/${appId}/sessions`, {
    json: true,
    validateStatus: () => true,
    headers: sessionHeaders
  })

  await app.stop()

  t.equal(response.status, 200, '200 status returned')
  t.deepEqual(response.data.length, 1, '1 session returned')
  t.notOk(response.data[0].app_id, 'app_id not returned')
  t.ok(response.data[0].date_created, 'date_created existed')
  t.ok(response.data[0].id, 'id existed')
  t.notOk(response.data[0].secret, 'secret not returned')
})
