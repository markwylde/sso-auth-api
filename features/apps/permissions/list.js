const test = require('tape')

const httpRequest = require('../../_support/httpRequest')
const app = require('../../_support/app')

const populateTestUser = require('../../_support/populates/populateTestUser')
const populateTestSession = require('../../_support/populates/populateTestSession')
const populateTestApp = require('../../_support/populates/populateTestApp')
const populateTestPermission = require('../../_support/populates/populateTestPermission')

const url = `http://localhost:${process.env.PORT}/v1`

test('list permission - will show no permissions if none exist', async function (t) {
  t.plan(2)

  await app.start()

  const myUser = await populateTestUser({
    perms: ['sso:app:authorise']
  })
  const mySession = await populateTestSession(myUser)
  const myApp = await populateTestApp({ session: mySession })

  const response = await httpRequest(`${url}/apps/${myApp.id}/permissions`, { json: true })

  await app.stop()

  t.equal(response.status, 200, '200 status returned')
  t.equal(response.data.length, 0, 'no permissions are returned')
})

test('list permission - will show permissions only for specified app', async function (t) {
  t.plan(2)

  await app.start()

  await (async function () {
    const myUser = await populateTestUser({
      perms: ['sso:app:authorise']
    })
    const mySession = await populateTestSession(myUser)
    const myApp = await populateTestApp({ session: mySession })
    await populateTestPermission({ app: myApp })
    await populateTestPermission({ app: myApp })
  })()

  const myUser = await populateTestUser({
    perms: ['sso:app:authorise']
  })
  const mySession = await populateTestSession(myUser)
  const myApp = await populateTestApp({ session: mySession })
  await populateTestPermission({ app: myApp })
  await populateTestPermission({ app: myApp })

  const response = await httpRequest(`${url}/apps/${myApp.id}/permissions`, {
    json: true, headers: mySession.headers
  })

  await app.stop()

  t.equal(response.status, 200, '200 status returned')
  t.equal(response.data.length, 2, 'two permissions are returned')
})

test('list permission - item has the correct properties', async function (t) {
  t.plan(9)

  await app.start()

  const myUser = await populateTestUser({
    perms: ['sso:app:authorise']
  })
  const mySession = await populateTestSession(myUser)
  const myApp = await populateTestApp({ session: mySession })
  const myPermission = await populateTestPermission({ app: myApp })

  const response = await httpRequest(`${url}/apps/${myApp.id}/permissions`, { json: true })

  await app.stop()

  t.equal(response.status, 200, '200 status returned')
  t.equal(Object.keys(response.data[0]).length, 6, '6 properties returned')

  t.equal(response.data[0].id, myPermission.id, 'id exists')
  t.notOk(response.data[0].app_id, 'app_id not returned')
  t.equal(response.data[0].permission, myPermission.permission, 'permission exists')
  t.equal(response.data[0].title, myPermission.title, 'title exists')
  t.equal(response.data[0].description, myPermission.description, 'description exists')
  t.equal(response.data[0].group, myPermission.group, 'group exists')
  t.ok(response.data[0].date_created, myPermission.date_created, 'date_created exists')
})
