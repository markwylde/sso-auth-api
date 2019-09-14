const test = require('tape')

const httpRequest = require('../_support/httpRequest')
const app = require('../_support/app')

const populateTestUser = require('../_support/populates/populateTestUser')
const populateTestSession = require('../_support/populates/populateTestSession')
const populateTestApp = require('../_support/populates/populateTestApp')
const populateTestPermission = require('../_support/populates/populateTestPermission')

const runFunctionMultipleTimes = require('../_support/runFunctionMultipleTimes')

const url = `http://localhost:${process.env.PORT}/v1`

test('list permission - will show no permissions if none exist', async function (t) {
  t.plan(2)

  await app.start()

  const response = await httpRequest(`${url}/permissions`, { json: true })

  await app.stop()

  t.equal(response.status, 200, '200 status returned')
  t.equal(response.data.length, 0, 'no permissions are returned')
})

test('list permission - will show only owned apps permissions', async function (t) {
  t.plan(2)

  await app.start()

  async function scenario () {
    const myUser = await populateTestUser({
      perms: ['sso:app:authorise']
    })
    const mySession = await populateTestSession(myUser)
    const myApp = await populateTestApp({ session: mySession, owner: myUser })

    await runFunctionMultipleTimes(5, () => {
      return populateTestPermission({ app: myApp })
    })

    return mySession
  }

  // Create some scenarios that we don't own
  await scenario()
  await scenario()
  const scenarioInstance2 = await scenario()

  const response = await httpRequest(`${url}/permissions`, {
    json: true,
    headers: scenarioInstance2.headers
  })

  await app.stop()

  t.equal(response.status, 200, '200 status returned')
  t.equal(response.data.length, 5, 'five permissions are returned')
})

test('list permission - item has the correct properties', async function (t) {
  t.plan(5)

  await app.start()

  const myUser = await populateTestUser({
    perms: ['sso:app:authorise']
  })
  const mySession = await populateTestSession(myUser)
  const myApp = await populateTestApp({ session: mySession, owner: myUser })
  await populateTestPermission({ app: myApp })

  const response = await httpRequest(`${url}/permissions`, {
    json: true, headers: mySession.headers
  })

  await app.stop()

  t.equal(response.status, 200, '200 status returned')
  t.ok(response.data[0].id, 'id exists')
  t.ok(response.data[0].app_id, 'app_id exists')
  t.ok(response.data[0].permission, 'permission exists')
  t.ok(response.data[0].date_created, 'date_created exists')
})
