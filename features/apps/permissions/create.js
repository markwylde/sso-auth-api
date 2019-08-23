const test = require('tape')

const httpRequests = require('../../_support/httpRequest')
const app = require('../../_support/app')
const db = require('../../../lib/services/database')

const populateTestUser = require('../../_support/populates/populateTestUser')
const populateTestSession = require('../../_support/populates/populateTestSession')
const populateTestApp = require('../../_support/populates/populateTestApp')

const url = `http://localhost:${process.env.PORT}/v1`

test('create permission - will return validation error with empty body', async function (t) {
  t.plan(6)

  await app.start()

  const myUser = await populateTestUser({
    perms: ['sso:app:authorise']
  })
  const mySession = await populateTestSession(myUser)
  const myApp = await populateTestApp({ session: mySession })

  const response = await httpRequests({
    url: `${url}/apps/${myApp.id}/permissions`,
    headers: mySession.headers,
    method: 'post',
    json: true,
    validateStatus: () => true
  })

  await app.stop()

  t.equal(response.status, 422, '422 status returned')
  t.equal(Object.keys(response.data.errors).length, 4, 'four errors existed')
  t.ok(response.data.errors.permission.includes('required'), 'permission is required')
  t.ok(response.data.errors.title.includes('required'), 'title is required')
  t.ok(response.data.errors.description.includes('required'), 'description is required')
  t.ok(response.data.errors.group.includes('required'), 'group is required')
})

test('create permission - will return validation error with invalid data', async function (t) {
  t.plan(6)

  await app.start()

  const myUser = await populateTestUser({
    perms: ['sso:app:authorise']
  })
  const mySession = await populateTestSession(myUser)
  const myApp = await populateTestApp({ session: mySession })

  const response = await httpRequests({
    url: `${url}/apps/${myApp.id}/permissions`,
    method: 'post',
    json: true,
    validateStatus: () => true,
    data: {
      permission: '',
      title: '',
      description: '',
      group: ''
    }
  })

  await app.stop()

  t.equal(response.status, 422, '422 status returned')
  t.equal(Object.keys(response.data.errors).length, 4, 'four errors existed')
  t.ok(response.data.errors.permission.includes('shorter than 1'), 'shorter than 1')
  t.ok(response.data.errors.title.includes('shorter than 1'), 'shorter than 1')
  t.ok(response.data.errors.description.includes('shorter than 1'), 'shorter than 1')
  t.ok(response.data.errors.group.includes('shorter than 1'), 'shorter than 1')
})

test('create permission - will return validation error for duplicate id', async function (t) {
  t.plan(3)

  await app.start()

  const myUser = await populateTestUser({
    perms: ['sso:app:authorise']
  })
  const mySession = await populateTestSession(myUser)
  const myApp = await populateTestApp({ session: mySession })

  await db.table('permissions').insert({
    id: `${myApp.id}:testpermission`,
    app_id: myApp.id,
    permission: `testpermission`,
    title: 'testtitle',
    description: 'testdescription',
    group: 'testgroup',
    date_created: new Date()
  })

  const response = await httpRequests({
    url: `${url}/apps/${myApp.id}/permissions`,
    headers: mySession.headers,
    method: 'post',
    json: true,
    validateStatus: () => true,
    data: {
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
  t.plan(8)

  await app.start()

  const myUser = await populateTestUser({
    perms: ['sso:app:authorise']
  })
  const mySession = await populateTestSession(myUser)
  const myApp = await populateTestApp({ session: mySession })

  const response = await httpRequests({
    url: `${url}/apps/${myApp.id}/permissions`,
    headers: mySession.headers,
    method: 'post',
    json: true,
    validateStatus: () => true,
    data: {
      permission: 'testpermission',
      title: 'testtitle',
      description: 'testdescription',
      group: 'testgroup'
    }
  })

  await app.stop()

  t.equal(response.status, 201, '201 status returned')
  t.equal(Object.keys(response.data).length, 6, 'six fields returned')
  t.ok(response.data.date_created, 'date_created existed')
  t.equal(response.data.id, `${myApp.id}:testpermission`, 'id returned correctly')
  t.equal(response.data.permission, 'testpermission', 'permission returned correctly')
  t.equal(response.data.title, 'testtitle', 'title returned correctly')
  t.equal(response.data.description, 'testdescription', 'description returned correctly')
  t.equal(response.data.group, 'testgroup', 'group returned correctly')
})
