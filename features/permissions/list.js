const test = require('tape')

const axios = require('../support/httpRequest')
const app = require('../support/app')
const db = require('../../lib/services/database')

const runFunctionMultipleTimes = require('../support/runFunctionMultipleTimes')

const url = `http://localhost:${process.env.PORT}/v1`

async function setupTestPermissions (userCount) {
  return runFunctionMultipleTimes(userCount, num => {
    return db.table('permissions').insert({
      id: `testapp:testpermission${num}`,
      app_id: 'testapp',
      permission: `testpermission${num}`,
      date_created: new Date()
    })
  })
}

test('list permission - will show no permissions if none exist', async function (t) {
  t.plan(2)

  await app.start()
  await setupTestPermissions(0)

  const response = await axios(`${url}/permissions`, { json: true })

  await app.stop()

  t.equal(response.status, 200, '200 status returned')
  t.equal(response.data.length, 0, 'no permissions are returned')
})

test('list permission - will show five permissions', async function (t) {
  t.plan(2)

  await app.start()
  await setupTestPermissions(5)

  const response = await axios(`${url}/permissions`, { json: true })

  await app.stop()

  t.equal(response.status, 200, '200 status returned')
  t.equal(response.data.length, 5, 'five permissions are returned')
})

test('list permission - item has the correct properties', async function (t) {
  t.plan(5)

  await app.start()

  await setupTestPermissions(1)

  const response = await axios(`${url}/permissions`, { json: true })

  await app.stop()

  t.equal(response.status, 200, '200 status returned')
  t.ok(response.data[0].id, 'id exists')
  t.ok(response.data[0].app_id, 'app_id exists')
  t.ok(response.data[0].permission, 'permission exists')
  t.ok(response.data[0].date_created, 'date_created exists')
})
