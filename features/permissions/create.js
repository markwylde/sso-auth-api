const test = require('tape')

const httpRequests = require('../support/httpRequest')
const app = require('../support/app')
const db = require('../../lib/services/database')

const url = `http://localhost:${process.env.PORT}/v1`

test('create permission - will return validation error with empty body', async function (t) {
  t.plan(7)

  await app.start()

  const response = await httpRequests({
    url: `${url}/permissions`,
    method: 'post',
    json: true,
    validateStatus: () => true
  })

  await app.stop()

  t.equal(response.status, 422, '422 status returned')
  t.equal(Object.keys(response.data.errors).length, 5, 'two errors existed')
  t.ok(response.data.errors.app_id.includes('required'), 'app_id is required')
  t.ok(response.data.errors.permission.includes('required'), 'permission is required')
  t.ok(response.data.errors.title.includes('required'), 'title is required')
  t.ok(response.data.errors.description.includes('required'), 'description is required')
  t.ok(response.data.errors.group.includes('required'), 'group is required')
})

test('create permission - will return validation error with invalid data', async function (t) {
  t.plan(7)

  await app.start()

  const response = await httpRequests({
    url: `${url}/permissions`,
    method: 'post',
    json: true,
    validateStatus: () => true,
    data: {
      app_id: 'a',
      permission: '',
      title: '',
      description: '',
      group: ''
    }
  })

  await app.stop()

  t.equal(response.status, 422, '422 status returned')
  t.equal(Object.keys(response.data.errors).length, 5, 'five errors existed')
  t.ok(response.data.errors.app_id.includes('shorter than 3'), 'shorter than 3')
  t.ok(response.data.errors.permission.includes('shorter than 1'), 'shorter than 1')
  t.ok(response.data.errors.title.includes('shorter than 1'), 'shorter than 1')
  t.ok(response.data.errors.description.includes('shorter than 1'), 'shorter than 1')
  t.ok(response.data.errors.group.includes('shorter than 1'), 'shorter than 1')
})

test('create permission - will return validation error for duplicate id', async function (t) {
  t.plan(3)

  await app.start()

  await db.table('permissions').insert({
    id: `testapp:testpermission`,
    app_id: 'testapp',
    permission: `testpermission`,
    title: 'testtitle',
    description: 'testdescription',
    group: 'testgroup',
    date_created: new Date()
  })

  const response = await httpRequests({
    url: `${url}/permissions`,
    method: 'post',
    json: true,
    validateStatus: () => true,
    data: {
      app_id: 'testapp',
      permission: 'testpermission',
      title: 'testtitle',
      description: 'testdescription',
      group: 'testgroup'
    }
  })

  await app.stop()

  t.equal(response.status, 422, '422 status returned')
  t.equal(Object.keys(response.data.errors).length, 1, 'one error existed')
  t.ok(response.data.errors.id.includes('already exists'), 'id already exists')
})

test('create permission - will create and return permission', async function (t) {
  t.plan(9)

  await app.start()

  const response = await httpRequests({
    url: `${url}/permissions`,
    method: 'post',
    json: true,
    validateStatus: () => true,
    data: {
      app_id: 'testapp',
      permission: 'testpermission',
      title: 'testtitle',
      description: 'testdescription',
      group: 'testgroup'
    }
  })

  await app.stop()

  t.equal(response.status, 201, '201 status returned')
  t.equal(Object.keys(response.data).length, 7, 'seven fields returned')
  t.ok(response.data.date_created, 'date_created existed')
  t.equal(response.data.id, 'testapp:testpermission', 'id returned correctly')
  t.equal(response.data.app_id, 'testapp', 'app_id returned correctly')
  t.equal(response.data.permission, 'testpermission', 'permission returned correctly')
  t.equal(response.data.title, 'testtitle', 'title returned correctly')
  t.equal(response.data.description, 'testdescription', 'description returned correctly')
  t.equal(response.data.group, 'testgroup', 'group returned correctly')
})
