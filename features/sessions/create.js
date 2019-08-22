const test = require('tape')

const axios = require('../support/httpRequest')
const app = require('../support/app')
const db = require('../../lib/services/database')
const { cryptPassword } = require('../../lib/services/crypt')

const url = `http://localhost:${process.env.PORT}/v1`

async function setupTestUser () {
  return db.table('users').insert({
    id: `testuser`,
    username: `testuser`,
    password: await cryptPassword('testpass'),
    date_created: new Date()
  })
}

test('create session - will return validation error', async function (t) {
  t.plan(4)

  await app.start()

  const response = await axios({
    url: `${url}/sessions`,
    method: 'post',
    json: true,
    validateStatus: () => true
  })

  await app.stop()

  t.equal(response.status, 422, '422 status returned')
  t.equal(Object.keys(response.data.errors).length, 2, 'three errors existed')
  t.ok(response.data.errors.username.includes('required'), 'username is required')
  t.ok(response.data.errors.password.includes('required'), 'password is required')
})

test('create session - will return session record', async function (t) {
  t.plan(4)

  await app.start()
  await setupTestUser()

  const response = await axios({
    url: `${url}/sessions`,
    method: 'post',
    json: true,
    validateStatus: () => true,
    data: {
      username: 'testuser',
      password: 'testpass'
    }
  })

  await app.stop()

  t.equal(response.status, 201, '201 status returned')
  t.equal(Object.keys(response.data).length, 2, 'two fields returned')
  t.ok(response.data.sessionId, 'sessionId exists')
  t.ok(response.data.sessionSecret, 'sessionSecret exists')
})

test('create session - will create db record', async function (t) {
  t.plan(4)

  await app.start()
  await setupTestUser()

  const response = await axios({
    url: `${url}/sessions`,
    method: 'post',
    json: true,
    validateStatus: () => true,
    data: {
      username: 'testuser',
      password: 'testpass'
    }
  })

  const dbRecord = await db.table('sessions').get(response.data.sessionId)

  await app.stop()

  t.equal(response.status, 201, '201 status returned')
  t.equal(dbRecord.user_id, 'testuser', 'db record had correct user property')
  t.equal(dbRecord.id, response.data.sessionId, 'db record had correct id property')
  t.equal(dbRecord.secret, response.data.sessionSecret, 'db record had correct secret property')
})
