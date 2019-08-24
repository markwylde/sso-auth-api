const test = require('tape')

const httpRequest = require('../../_support/httpRequest')
const app = require('../../_support/app')

const populateTestUser = require('../../_support/populates/populateTestUser')
const populateTestSession = require('../../_support/populates/populateTestSession')
const populateTestApp = require('../../_support/populates/populateTestApp')
const populateTestAppSession = require('../../_support/populates/populateTestAppSession')

const url = `http://localhost:${process.env.PORT}/v1`

test('read app session - will return 404 if session could not be found', async function (t) {
  t.plan(1)

  await app.start()

  const myUser = await populateTestUser({
    perms: ['sso:app:authorise']
  })
  const mySession = await populateTestSession(myUser)
  const myApp = await populateTestApp({ session: mySession })

  const response = await httpRequest({
    url: `${url}/apps/${myApp.id}/sessions/notfoundsession`,
    headers: mySession.headers,
    method: 'get',
    json: true,
    validateStatus: () => true
  })

  await app.stop()

  t.equal(response.status, 404, '404 Not Found returned')
})

test('read app session - will return unauthorised if wrong secret provided', async function (t) {
  t.plan(1)

  await app.start()

  const myUser = await populateTestUser({
    perms: ['sso:app:authorise']
  })
  const mySession = await populateTestSession(myUser)
  const myApp = await populateTestApp({ session: mySession })
  const myAppSession = await populateTestAppSession({ app: myApp })

  const response = await httpRequest({
    url: `${url}/apps/${myApp.id}/sessions/current`,
    json: true,
    headers: myAppSession.headers,
    validateStatus: () => true
  })

  await app.stop()

  t.equal(response.status, 401, '401 Unauthorised returned')
})

test('read app session - will return session if exists', async function (t) {
  t.plan(2)

  await app.start()

  const myUser = await populateTestUser({
    perms: ['sso:app:authorise']
  })
  const mySession = await populateTestSession(myUser)
  const myApp = await populateTestApp({ session: mySession })
  const myAppSession = await populateTestAppSession({ app: myApp })

  const response = await httpRequest({
    url: `${url}/apps/${myApp.id}/sessions/current`,
    json: true,
    headers: {
      'X-App-Secret': myApp.secret,
      ...myAppSession.headers
    }
  })

  await app.stop()

  t.equal(response.status, 200, '200 Found returned')
  t.equal(response.data.id, myAppSession.sessionId, 'id was correct')
})
