const test = require('tape')

const httpRequest = require('../../support/httpRequest')
const app = require('../../support/app')

const setupTestApps = require('../../support/setupTestApps')
const setupTestUserWithSession = require('../../support/setupTestUserWithSession')

const url = `http://localhost:${process.env.PORT}/v1`

test('create session - will return error if app not found', async function (t) {
  t.plan(1)

  await app.start()

  const sessionHeaders = await setupTestUserWithSession({
    permissions: []
  })

  const response = await httpRequest({
    url: `${url}/apps/notexists/sessions`,
    method: 'post',
    json: true,
    validateStatus: () => true,
    headers: sessionHeaders
  })

  await app.stop()

  t.equal(response.status, 404, '404 status returned')
})

test('create session - will return error if missing app secret', async function (t) {
  t.plan(2)

  await app.start()

  const sessionHeaders = await setupTestUserWithSession({
    permissions: []
  })

  const apps = await setupTestApps(1, { headers: sessionHeaders, activate: true })
  const appId = apps[0].data.id

  const response = await httpRequest({
    url: `${url}/apps/${appId}/sessions`,
    method: 'post',
    json: true,
    validateStatus: () => true,
    headers: sessionHeaders
  })

  await app.stop()

  t.equal(response.status, 401, '401 status returned')
  t.deepEqual(Object.keys(response.data), {}, 'no body returned')
})

test('create session - will return error if missing app secret', async function (t) {
  t.plan(3)

  await app.start()

  const sessionHeaders = await setupTestUserWithSession({
    permissions: []
  })

  const apps = await setupTestApps(1, { headers: sessionHeaders, activate: true })
  const appId = apps[0].data.id
  const appSecret = apps[0].data.secret

  const response = await httpRequest({
    url: `${url}/apps/${appId}/sessions`,
    method: 'post',
    json: true,
    validateStatus: () => true,
    headers: {
      'X-App-Secret': appSecret
    }
  })

  await app.stop()

  t.equal(response.status, 201, '201 status returned')
  t.ok(response.data.sessionId, 'sessionId existed')
  t.ok(response.data.sessionSecret, 'sessionSecret existed')
})
