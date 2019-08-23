const test = require('tape')

const httpRequest = require('../../_support/httpRequest')
const app = require('../../_support/app')

const populateTestUser = require('../../_support/populates/populateTestUser')
const populateTestSession = require('../../_support/populates/populateTestSession')
const populateTestApp = require('../../_support/populates/populateTestApp')

const url = `http://localhost:${process.env.PORT}/v1`

test('create app session - will return error if app not found', async function (t) {
  t.plan(1)

  await app.start()

  const myUser = await populateTestUser()
  const mySession = await populateTestSession(myUser)

  const response = await httpRequest({
    url: `${url}/apps/notexists/sessions`,
    method: 'post',
    json: true,
    validateStatus: () => true,
    headers: mySession.headers
  })

  await app.stop()

  t.equal(response.status, 404, '404 status returned')
})

test('create app session - will return error if missing app secret', async function (t) {
  t.plan(2)

  await app.start()

  const myUser = await populateTestUser({
    perms: ['sso:app:authorise']
  })
  const mySession = await populateTestSession(myUser)
  const myApp = await populateTestApp({ session: mySession })

  const response = await httpRequest({
    url: `${url}/apps/${myApp.id}/sessions`,
    method: 'post',
    json: true,
    validateStatus: () => true,
    headers: mySession.headers
  })

  await app.stop()

  t.equal(response.status, 401, '401 status returned')
  t.deepEqual(Object.keys(response.data), {}, 'no body returned')
})

test('create app session - will create session', async function (t) {
  t.plan(3)

  await app.start()

  const myUser = await populateTestUser({
    perms: ['sso:app:authorise']
  })
  const mySession = await populateTestSession(myUser)
  const myApp = await populateTestApp({ session: mySession })

  const response = await httpRequest({
    url: `${url}/apps/${myApp.id}/sessions`,
    method: 'post',
    json: true,
    validateStatus: () => true,
    headers: {
      'X-App-Secret': myApp.secret
    }
  })

  await app.stop()

  t.equal(response.status, 201, '201 status returned')
  t.ok(response.data.sessionId, 'sessionId existed')
  t.ok(response.data.sessionSecret, 'sessionSecret existed')
})
