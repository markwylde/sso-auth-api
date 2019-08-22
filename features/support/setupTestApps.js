const httpRequest = require('./httpRequest')
const runFunctionMultipleTimes = require('./runFunctionMultipleTimes')

const url = `http://localhost:${process.env.PORT}/v1`

async function setupTestApps (appCount, opts = {}) {
  return runFunctionMultipleTimes(appCount, async num => {
    const appItem = await httpRequest({
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
      await httpRequest({
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

module.exports = setupTestApps
