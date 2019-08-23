const test = require('tape')

const httpRequest = require('../../_support/httpRequest')
const app = require('../../_support/app')

const populateTestUser = require('../../_support/populates/populateTestUser')
const populateTestSession = require('../../_support/populates/populateTestSession')
const populateTestApp = require('../../_support/populates/populateTestApp')

const url = `http://localhost:${process.env.PORT}/v1`

test.only('read app session - will return 404 if session could not be found', async function (t) {
  t.plan(1)

  await app.start()

  const myUser = await populateTestUser({
    perms: ['sso:app:authorise']
  })
  const mySession = await populateTestSession(myUser)
  const myApp = await populateTestApp({ session: mySession })

  const response = await httpRequest({
    url: `${url}/apps/${myApp.id}/sessions/notfoundsession`,
    headers: mySession.headers,
    method: 'get',
    json: true,
    validateStatus: () => true
  })

  await app.stop()

  t.equal(response.status, 404, '404 Not Found returned')
})
