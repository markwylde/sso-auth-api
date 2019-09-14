const test = require('tape')

const httpRequest = require('../_support/httpRequest')
const app = require('../_support/app')

const populateTestUser = require('../_support/populates/populateTestUser')
const populateTestSession = require('../_support/populates/populateTestSession')
const populateTestApp = require('../_support/populates/populateTestApp')

const url = `http://localhost:${process.env.PORT}/v1`

test('read app - will return 404 if app could not be found', async function (t) {
  t.plan(1)

  await app.start()

  const myUser = await populateTestUser()
  const mySession = await populateTestSession(myUser)

  const response = await httpRequest({
    url: `${url}/apps/notexisting`,
    headers: mySession.headers,
    method: 'get',
    json: true,
    validateStatus: () => true
  })

  await app.stop()

  t.equal(response.status, 404, '404 Not Found returned')
})

test('read app - will return app when exists', async function (t) {
  t.plan(10)

  await app.start()

  const myUser = await populateTestUser({
    perms: ['sso:app:authorise']
  })
  const mySession = await populateTestSession(myUser)
  const myApp = await populateTestApp({ session: mySession, owner: myUser })

  const response = await httpRequest({
    url: `${url}/apps/${myApp.id}`,
    headers: mySession.headers,
    method: 'get',
    json: true,
    validateStatus: () => true
  })

  await app.stop()

  t.equal(response.status, 200, '200 status returned')

  t.equal(Object.keys(response.data).length, 6, 'six fields returned')
  t.ok(response.data.date_created, 'date_created existed')
  t.ok(response.data.id, 'id returned correctly')
  t.notOk(response.data.secret, 'secret is not returned')
  t.notOk(response.data.activation_url, 'activation_url is not returned')
  t.ok(response.data.user_id, 'user_id is returned')
  t.ok(response.data.date_activated, 'date_activated is not returned')
  t.equal(response.data.title, myApp.title, 'title returned correctly')
  t.equal(response.data.active, true, 'active returned correctly')
})
