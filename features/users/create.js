const test = require('tape')
const axios = require('axios')

const app = require('../support/app')
const db = require('../../lib/services/database')

const runFunctionMultipleTimes = require('../support/runFunctionMultipleTimes')

const url = `http://localhost:${process.env.PORT}/v1`

function clearUsers () {
  return db.table('users').delete()
}

test('create user - will return validation error with empty body', async function (t) {
  t.plan(5)

  await app.start()
  await clearUsers()

  const response = await axios({
    url: `${url}/users`,
    method: 'post',
    json: true,
    validateStatus: () => true
  })

  await app.stop()

  t.equal(response.status, 422, '422 status returned')
  t.equal(Object.keys(response.data.errors).length, 3, 'three errors existed')
  t.ok(response.data.errors.username.includes('required'), 'username is required')
  t.ok(response.data.errors.password.includes('required'), 'password is required')
  t.ok(response.data.errors.password_confirmation.includes('required'), 'password_confirmation is required')
})

test('create user - will return validation error with invalid data', async function (t) {
  t.plan(5)

  await app.start()
  await clearUsers()

  const response = await axios({
    url: `${url}/users`,
    method: 'post',
    json: true,
    validateStatus: () => true,
    data: {
      username: 'a',
      password: 'a',
      password_confirmation: 'a'
    }
  })

  await app.stop()

  t.equal(response.status, 422, '422 status returned')
  t.equal(Object.keys(response.data.errors).length, 3, 'three errors existed')
  t.ok(response.data.errors.username.includes('shorter than 3'), 'shorter than 3')
  t.ok(response.data.errors.password.includes('shorter than 6'), 'shorter than 6')
  t.ok(response.data.errors.password_confirmation.includes('shorter than 6'), 'shorter than 6')
})
