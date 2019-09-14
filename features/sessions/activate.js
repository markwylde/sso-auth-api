const test = require('tape')

const httpRequest = require('../_support/httpRequest')
const app = require('../_support/app')

const populateTestUser = require('../_support/populates/populateTestUser')
const populateTestSession = require('../_support/populates/populateTestSession')
const populateTestApp = require('../_support/populates/populateTestApp')
const populateTestAppSession = require('../_support/populates/populateTestAppSession')

const url = `http://localhost:${process.env.PORT}/v1`

test('activate session - will return 404 if session could not be found', async function (t) {
  t.plan(1)

  await app.start()

  const response = await httpRequest({
    url: `${url}/sessions/current/activate?sessionId=notfound`,
    headers: {
      'x-session-id': 'test',
      'x-session-secret': 'test'
    },
    method: 'get',
    json: true,
    validateStatus: () => true
  })

  await app.stop()

  t.equal(response.status, 404, '404 Not Found returned')
})

test('activate session - will return 404 if app session could not be found', async function (t) {
  t.plan(1)

  await app.start()

  const myUser = await populateTestUser({
    perms: ['sso:app:authorise']
  })
  const mySession = await populateTestSession(myUser)
  await populateTestApp({ session: mySession, owner: myUser })

  const response = await httpRequest({
    url: `${url}/sessions/current/activate?sessionId=notfound`,
    headers: mySession.headers,
    method: 'get',
    json: true,
    validateStatus: () => true
  })

  await app.stop()

  t.equal(response.status, 404, '404 Not Found returned')
})

test('activate session - will apply user to session successfully', async function (t) {
  t.plan(1)

  await app.start()

  const myUser = await populateTestUser({
    perms: ['sso:app:authorise']
  })
  const mySession = await populateTestSession(myUser)
  const myApp = await populateTestApp({ session: mySession, owner: myUser })
  const myAppSession = await populateTestAppSession({ app: myApp })

  const theirUser = await populateTestUser()
  const theirSession = await populateTestSession(theirUser)

  const response = await httpRequest({
    url: `${url}/sessions/current/activate?sessionId=${myAppSession.sessionId}`,
    headers: theirSession.headers,
    method: 'post',
    json: true,
    validateStatus: () => true
  })

  await app.stop()

  t.equal(response.status, 200, '200 OK returned')
})

test('activate session - will fail to activate twice', async function (t) {
  t.plan(1)

  await app.start()

  const myUser = await populateTestUser({
    perms: ['sso:app:authorise']
  })
  const mySession = await populateTestSession(myUser)
  const myApp = await populateTestApp({ session: mySession, owner: myUser })
  const myAppSession = await populateTestAppSession({ app: myApp })

  const theirUser = await populateTestUser()
  const theirSession = await populateTestSession(theirUser)

  await httpRequest({
    url: `${url}/sessions/current/activate?sessionId=${myAppSession.sessionId}`,
    headers: theirSession.headers,
    method: 'post',
    json: true,
    validateStatus: () => true
  })

  const secondActivationRequest = await httpRequest({
    url: `${url}/sessions/current/activate?sessionId=${myAppSession.sessionId}`,
    headers: theirSession.headers,
    method: 'post',
    json: true,
    validateStatus: () => true
  })

  await app.stop()

  t.equal(secondActivationRequest.status, 422, '200 OK returned')
})
