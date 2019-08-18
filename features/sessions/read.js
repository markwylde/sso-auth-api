const test = require('tape')
const axios = require('axios')

const app = require('../support/app')
const db = require('../../lib/services/database')
const {cryptPassword} = require('../../lib/services/crypt')

const runFunctionMultipleTimes = require('../support/runFunctionMultipleTimes')

const url = `http://localhost:${process.env.PORT}/v1`

async function clearUsersAndSessions () {
  await db.table('users').delete()
  await db.table('sessions').delete()
}

async function setupTestUser () {
  return db.table('users').insert({
    id: 'testuser',
    username: 'testuser',
    password: await cryptPassword('testpass'),
    date_created: new Date()
  })
}

async function setupTestSession () {
  return db.table('sessions').insert({
    id: 'testsessionid',
    user: 'testuser',
    secret: 'testsessionsecret',
    date_created: new Date()
  })
}

test('read session - will return 404 if session could not be found', async function (t) {
  t.plan(1)

  await app.start()
  await clearUsersAndSessions()

  const response = await axios({
    url: `${url}/sessions/current`,
    headers: {
      'x-session-id': 'test',
      'x-session-secret': 'test',
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
  await clearUsersAndSessions()
  await setupTestUser()
  await setupTestSession()

  const response = await axios({
    url: `${url}/sessions/current`,
    headers: {
      'x-session-id': 'testsessionid',
      'x-session-secret': 'testsessionsecret',
    },
    method: 'get',
    json: true,
    validateStatus: () => true
  })

  await app.stop()

  t.equal(response.status, 200, '200 status returned')
})
