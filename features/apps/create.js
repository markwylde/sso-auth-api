const test = require('tape')

const httpRequest = require('../_support/httpRequest')
const app = require('../_support/app')
const db = require('../../lib/services/database')

const url = `http://localhost:${process.env.PORT}/v1`

test('create app - will return validation error with empty body', async function (t) {
  t.plan(3)

  await app.start()

  const response = await httpRequest({
    url: `${url}/apps`,
    method: 'post',
    json: true,
    validateStatus: () => true
  })

  await app.stop()

  t.equal(response.status, 422, '422 status returned')
  t.equal(Object.keys(response.data.errors).length, 1, 'one error existed')
  t.ok(response.data.errors.title.includes('required'), 'title is required')
})

test('create app - will return validation error with invalid data', async function (t) {
  t.plan(3)

  await app.start()

  const response = await httpRequest({
    url: `${url}/apps`,
    method: 'post',
    json: true,
    validateStatus: () => true,
    data: {
      title: ''
    }
  })

  await app.stop()

  t.equal(response.status, 422, '422 status returned')
  t.equal(Object.keys(response.data.errors).length, 1, 'one error existed')
  t.ok(response.data.errors.title.includes('shorter than 3'), 'shorter than 3')
})

test('create app - will return validation error for duplicate title', async function (t) {
  t.plan(3)

  await app.start()

  await db.table('apps').insert({
    title: 'testtitle',
    date_created: new Date()
  })

  const response = await httpRequest({
    url: `${url}/apps`,
    method: 'post',
    json: true,
    validateStatus: () => true,
    data: {
      title: 'testtitle'
    }
  })

  await app.stop()

  t.equal(response.status, 422, '422 status returned')
  t.equal(Object.keys(response.data.errors).length, 1, 'one error existed')
  t.ok(response.data.errors.title.includes('already exists'), 'title already exists')
})

test('create app - will create and return app', async function (t) {
  t.plan(8)

  await app.start()

  const response = await httpRequest({
    url: `${url}/apps`,
    method: 'post',
    json: true,
    validateStatus: () => true,
    data: {
      title: 'testtitle'
    }
  })

  await app.stop()

  t.equal(response.status, 201, '201 status returned')
  t.equal(Object.keys(response.data).length, 6, 'six fields returned')
  t.ok(response.data.date_created, 'date_created existed')
  t.ok(response.data.id, 'id returned correctly')
  t.ok(response.data.secret, 'secret returned correctly')
  t.equal(response.data.title, 'testtitle', 'title returned correctly')
  t.equal(response.data.active, false, 'active returned correctly')
  t.equal(response.data.activation_url, `${process.env.APP_PUBLIC_URL}/apps/${response.data.id}/activate`, 'activation_url returned correctly')
})
