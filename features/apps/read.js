const test = require('tape')

const axios = require('../support/httpRequest')
const app = require('../support/app')

const setupTestUserWithSession = require('../support/setupTestUserWithSession')
const runFunctionMultipleTimes = require('../support/runFunctionMultipleTimes')

const url = `http://localhost:${process.env.PORT}/v1`

async function setupTestApps (appCount, opts = {}) {
  return runFunctionMultipleTimes(appCount, async num => {
    const appItem = await axios({
      url: `${url}/apps`,
      method: 'post',
      json: true,
      validateStatus: () => true,
      headers: opts && opts.headers,
      data: {
        title: `testtitle${opts.prefix || ''}${num}`
      }
    })

    if (opts && opts.activate) {
      await axios({
        url: `${url}/apps/${appItem.data.id}/activate`,
        method: 'post',
        json: true,
        validateStatus: () => true,
        headers: opts.headers
      })
    }

    return appItem
  })
}

test('read app - will return 404 if session could not be found', async function (t) {
  t.plan(1)

  await app.start()

  const sessionHeaders = await setupTestUserWithSession({
    permissions: []
  })

  const response = await axios({
    url: `${url}/apps/notexisting`,
    headers: sessionHeaders,
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

  const sessionHeaders = await setupTestUserWithSession({
    permissions: ['sso:app:authorise']
  })

  const apps = await setupTestApps(1, { headers: sessionHeaders, activate: true })
  const appId = apps[0].data.id

  const response = await axios({
    url: `${url}/apps/${appId}`,
    headers: sessionHeaders,
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
  t.equal(response.data.title, 'testtitle1', 'title returned correctly')
  t.equal(response.data.active, true, 'active returned correctly')
})
