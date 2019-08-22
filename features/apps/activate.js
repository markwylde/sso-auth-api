const test = require('tape')

const httpRequest = require('../support/httpRequest')
const app = require('../support/app')

const setupTestUserWithSession = require('../support/setupTestUserWithSession')

const url = `http://localhost:${process.env.PORT}/v1`

async function createTestApp () {
  const response = await httpRequest({
    url: `${url}/apps`,
    method: 'post',
    json: true,
    validateStatus: () => true,
    data: {
      title: 'testapp'
    }
  })

  return response.data
}

test('activate app - no session will return unauthorised', async function (t) {
  t.plan(1)

  await app.start()

  const testApp = await createTestApp()

  const response = await httpRequest({
    url: `${url}/apps/${testApp.id}/activate`,
    method: 'post',
    json: true,
    validateStatus: () => true
  })

  await app.stop()

  t.equal(response.status, 401, '401 status returned')
})

test('activate app - no permission will return unauthorised', async function (t) {
  t.plan(1)

  await app.start()

  const testUser = await setupTestUserWithSession({
    permissions: []
  })

  const testApp = await createTestApp()

  const response = await httpRequest({
    url: `${url}/apps/${testApp.id}/activate`,
    method: 'post',
    json: true,
    validateStatus: () => true,
    headers: testUser
  })

  await app.stop()

  t.equal(response.status, 401, '401 status returned')
})

test('activate app - will return not found error', async function (t) {
  t.plan(1)

  await app.start()

  const testUser = await setupTestUserWithSession({
    permissions: ['sso:app:authorise']
  })

  const response = await httpRequest({
    url: `${url}/apps/doesnotexist/activate`,
    method: 'post',
    json: true,
    validateStatus: () => true,
    headers: testUser
  })

  await app.stop()

  t.equal(response.status, 404, '404 status returned')
})

test('activate app - will activate an app', async function (t) {
  t.plan(1)

  await app.start()

  const testUser = await setupTestUserWithSession({
    permissions: ['sso:app:authorise']
  })

  const testApp = await createTestApp()

  const response = await httpRequest({
    url: `${url}/apps/${testApp.id}/activate`,
    method: 'post',
    json: true,
    validateStatus: () => true,
    headers: testUser
  })

  await app.stop()

  t.equal(response.status, 200, '200 status returned')
})

test('activate app - will activate an app as an admin', async function (t) {
  t.plan(1)

  await app.start()

  const testUser = await setupTestUserWithSession({
    permissions: ['sso:auth_admin:update']
  })

  const testApp = await createTestApp()

  const response = await httpRequest({
    url: `${url}/apps/${testApp.id}/activate`,
    method: 'post',
    json: true,
    validateStatus: () => true,
    headers: testUser
  })

  await app.stop()

  t.equal(response.status, 200, '200 status returned')
})
