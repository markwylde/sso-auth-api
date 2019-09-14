const test = require('tape')

const httpRequest = require('../_support/httpRequest')
const app = require('../_support/app')
const db = require('../../lib/services/database')

const populateTestUser = require('../_support/populates/populateTestUser')
const populateTestSession = require('../_support/populates/populateTestSession')
const populateTestApp = require('../_support/populates/populateTestApp')
const populateTestAppSession = require('../_support/populates/populateTestAppSession')
const populateTestPermission = require('../_support/populates/populateTestPermission')

const url = `http://localhost:${process.env.PORT}/v1`

test('read session - will return 404 if session could not be found', async function (t) {
  t.plan(1)

  await app.start()

  const response = await httpRequest({
    url: `${url}/sessions/current`,
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

test('read session - will return session when exists', async function (t) {
  t.plan(1)

  await app.start()
  const myUser = await populateTestUser()
  const mySession = await populateTestSession(myUser)

  const response = await httpRequest({
    url: `${url}/sessions/current`,
    headers: {
      'x-session-id': mySession.sessionId,
      'x-session-secret': mySession.sessionSecret
    },
    method: 'get',
    json: true,
    validateStatus: () => true
  })

  await app.stop()

  t.equal(response.status, 200, '200 status returned')
})

test('read session - will return not found when not sso session', async function (t) {
  t.plan(2)

  await app.start()
  const myUser = await populateTestUser()

  await db.table('sessions').insert({
    id: 'testsessionid',
    secret: 'testsessionsecret',
    user_id: myUser.id,
    app_id: 'notsso',
    date_created: new Date()
  })

  const response = await httpRequest({
    url: `${url}/sessions/current`,
    headers: {
      'x-session-id': 'testsessionid',
      'x-session-secret': 'testsessionsecret'
    },
    method: 'get',
    json: true,
    validateStatus: () => true
  })

  await app.stop()

  t.equal(response.status, 404, '404 status returned')
  t.deepEqual(response.data, {}, 'no body returned')
})

test('read session - will return session when exists from cookie', async function (t) {
  t.plan(1)

  await app.start()
  const myUser = await populateTestUser()
  const mySession = await populateTestSession(myUser)

  const response = await httpRequest({
    url: `${url}/sessions/current`,
    headers: {
      Cookie: `sessionId=${mySession.sessionId}; sessionSecret=${mySession.sessionSecret};`
    },
    method: 'get',
    json: true,
    validateStatus: () => true
  })

  await app.stop()

  t.equal(response.status, 200, '200 status returned')
})

test('read session - will return perms with session', async function (t) {
  t.plan(3)

  await app.start()
  const myUser = await populateTestUser({
    perms: ['sso:app:authorise']
  })
  const mySession = await populateTestSession(myUser)
  const myApp = await populateTestApp({ session: mySession, owner: myUser })
  const myAppPermission = await populateTestPermission({ app: myApp })

  await db.table('users').get(myUser.id).update({
    perms: [myAppPermission.id]
  })

  const response = await httpRequest({
    url: `${url}/sessions/current`,
    headers: {
      'x-session-id': mySession.sessionId,
      'x-session-secret': mySession.sessionSecret
    },
    method: 'get',
    json: true,
    validateStatus: () => true
  })

  await app.stop()

  t.equal(response.status, 200, '200 status returned')
  t.ok(response.data.perms.length > 0, 'perms where returned')
  t.equal(response.data.perms[0], myAppPermission.id, 'perms where returned')
})
