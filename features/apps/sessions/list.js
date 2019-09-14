const test = require('tape')

const httpRequest = require('../../_support/httpRequest')
const app = require('../../_support/app')

const populateTestUser = require('../../_support/populates/populateTestUser')
const populateTestSession = require('../../_support/populates/populateTestSession')
const populateTestApp = require('../../_support/populates/populateTestApp')

const url = `http://localhost:${process.env.PORT}/v1`

test('list app sessions - will return unauthorised if no user', async function (t) {
  t.plan(2)

  await app.start()

  const myUser = await populateTestUser({
    perms: ['sso:app:authorise']
  })
  const mySession = await populateTestSession(myUser)
  const myApp = await populateTestApp({ session: mySession })

  const response = await httpRequest(`${url}/apps/${myApp.id}/sessions`, {
    json: true,
    validateStatus: () => true
  })

  await app.stop()

  t.equal(response.status, 401, '401 status returned')
  t.deepEqual(response.data, {}, 'nothing is returned')
})

test('list app sessions - will return unauthorised if wrong user', async function (t) {
  t.plan(2)

  await app.start()

  const myUser = await populateTestUser({
    perms: ['sso:app:authorise']
  })
  const mySession = await populateTestSession(myUser)
  const myApp = await populateTestApp({ session: mySession })

  const anotherUser = await populateTestUser()
  const anotherSession = await populateTestSession(anotherUser)

  const response = await httpRequest(`${url}/apps/${myApp.id}/sessions`, {
    json: true,
    validateStatus: () => true,
    headers: anotherSession.headers
  })

  await app.stop()

  t.equal(response.status, 401, '401 status returned')
  t.deepEqual(response.data, {}, 'nothing is returned')
})

test('list app sessions - will return not found if no app', async function (t) {
  t.plan(2)

  await app.start()

  const myUser = await populateTestUser({
    perms: ['sso:app:authorise']
  })
  const mySession = await populateTestSession(myUser)

  const response = await httpRequest(`${url}/apps/notreal/sessions`, {
    json: true,
    validateStatus: () => true,
    headers: mySession.headers
  })

  await app.stop()

  t.equal(response.status, 404, '404 status returned')
  t.deepEqual(response.data, {}, 'nothing is returned')
})

test('list app sessions - will return no apps sessions', async function (t) {
  t.plan(2)

  await app.start()

  const myUser = await populateTestUser({
    perms: ['sso:app:authorise']
  })
  const mySession = await populateTestSession(myUser)
  const myApp = await populateTestApp({ session: mySession })

  const response = await httpRequest(`${url}/apps/${myApp.id}/sessions`, {
    json: true,
    validateStatus: () => true,
    headers: mySession.headers
  })

  await app.stop()

  t.equal(response.status, 200, '200 status returned')
  t.deepEqual(response.data.length, 0, '0 sessions returned is returned')
})

test('list app sessions - will return apps sessions', async function (t) {
  t.plan(6)

  await app.start()

  const myUser = await populateTestUser({
    perms: ['sso:app:authorise']
  })
  const mySession = await populateTestSession(myUser)
  const myApp = await populateTestApp({ session: mySession })

  await httpRequest(`${url}/apps/${myApp.id}/sessions`, {
    method: 'post',
    json: true,
    validateStatus: () => true,
    headers: {
      'X-App-Secret': myApp.secret,
      ...mySession.headers
    }
  })

  const response = await httpRequest(`${url}/apps/${myApp.id}/sessions`, {
    json: true,
    validateStatus: () => true,
    headers: mySession.headers
  })

  await app.stop()

  t.equal(response.status, 200, '200 status returned')
  t.deepEqual(response.data.length, 1, '1 session returned')
  t.notOk(response.data[0].app_id, 'app_id not returned')
  t.ok(response.data[0].date_created, 'date_created existed')
  t.ok(response.data[0].id, 'id existed')
  t.notOk(response.data[0].secret, 'secret not returned')
})
