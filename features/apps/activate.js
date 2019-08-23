const test = require('tape')

const httpRequest = require('../_support/httpRequest')
const app = require('../_support/app')

const populateTestUser = require('../_support/populates/populateTestUser')
const populateTestSession = require('../_support/populates/populateTestSession')
const populateTestApp = require('../_support/populates/populateTestApp')

const url = `http://localhost:${process.env.PORT}/v1`

test('activate app - no session will return unauthorised', async function (t) {
  t.plan(1)

  await app.start()

  const myUser = await populateTestUser({
    perms: ['sso:app:authorise']
  })
  const mySession = await populateTestSession(myUser)
  const myApp = await populateTestApp({ session: mySession })

  const response = await httpRequest({
    url: `${url}/apps/${myApp.id}/activate`,
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

  const myUser = await populateTestUser({
    perms: []
  })
  const mySession = await populateTestSession(myUser)
  const myApp = await populateTestApp()

  const response = await httpRequest({
    url: `${url}/apps/${myApp.id}/activate`,
    method: 'post',
    json: true,
    validateStatus: () => true,
    headers: mySession.headers
  })

  await app.stop()

  t.equal(response.status, 401, '401 status returned')
})

test('activate app - will return not found error', async function (t) {
  t.plan(1)

  await app.start()

  const myUser = await populateTestUser({
    perms: ['sso:app:authorise']
  })
  const mySession = await populateTestSession(myUser)

  const response = await httpRequest({
    url: `${url}/apps/doesnotexist/activate`,
    method: 'post',
    json: true,
    validateStatus: () => true,
    headers: mySession.headers
  })

  await app.stop()

  t.equal(response.status, 404, '404 status returned')
})

test('activate app - will activate an app', async function (t) {
  t.plan(1)

  await app.start()

  const myUser = await populateTestUser({
    perms: ['sso:app:authorise']
  })
  const mySession = await populateTestSession(myUser)
  const myApp = await populateTestApp()

  const response = await httpRequest({
    url: `${url}/apps/${myApp.id}/activate`,
    method: 'post',
    json: true,
    validateStatus: () => true,
    headers: mySession.headers
  })

  await app.stop()

  t.equal(response.status, 200, '200 status returned')
})

test('activate app - will activate an app as an admin', async function (t) {
  t.plan(1)

  await app.start()

  const myUser = await populateTestUser({
    perms: ['sso:auth_admin:update']
  })
  const mySession = await populateTestSession(myUser)
  const myApp = await populateTestApp()

  const response = await httpRequest({
    url: `${url}/apps/${myApp.id}/activate`,
    method: 'post',
    json: true,
    validateStatus: () => true,
    headers: mySession.headers
  })

  await app.stop()

  t.equal(response.status, 200, '200 status returned')
})
