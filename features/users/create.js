const test = require('tape')

const axios = require('../support/httpRequest')
const app = require('../support/app')
const db = require('../../lib/services/database')

const url = `http://localhost:${process.env.PORT}/v1`

test('create user - will return validation error with empty body', async function (t) {
  t.plan(5)

  await app.start()

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

test('create user - will return validation error for duplicate username', async function (t) {
  t.plan(3)

  await app.start()

  await db.table('users').insert({
    username: 'existinguser'
  })

  const response = await axios({
    url: `${url}/users`,
    method: 'post',
    json: true,
    validateStatus: () => true,
    data: {
      username: 'existinguser',
      password: 'examplepassword',
      password_confirmation: 'examplepassword'
    }
  })

  await app.stop()

  t.equal(response.status, 422, '422 status returned')
  t.equal(Object.keys(response.data.errors).length, 1, 'one error existed')
  t.ok(response.data.errors.username.includes('already exists'), 'username already exists')
})

test('create user - will create and return valid user', async function (t) {
  t.plan(5)

  await app.start()

  const response = await axios({
    url: `${url}/users`,
    method: 'post',
    json: true,
    validateStatus: () => true,
    data: {
      username: 'mytestuser',
      password: 'mytestpassword',
      password_confirmation: 'mytestpassword'
    }
  })

  await app.stop()

  t.equal(response.status, 201, '201 status returned')
  t.equal(Object.keys(response.data).length, 3, 'three properties existed')
  t.ok(response.data.id, 'id included')
  t.equal(response.data.username, 'mytestuser', 'username returned correctly')
  t.ok(response.data.date_created, 'date_created included')
})
