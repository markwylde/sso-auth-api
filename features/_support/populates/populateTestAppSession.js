const httpRequest = require('../httpRequest')

const url = `http://localhost:${process.env.PORT}/v1`

async function populateTestSession (opts) {
  const request = await httpRequest({
    url: `${url}/apps/${opts.app.id}/sessions`,
    method: 'post',
    json: true,
    validateStatus: () => true,
    headers: {
      'X-App-Secret': opts.app.secret
    }
  })

  return {
    headers: {
      'X-Session-Id': request.data.sessionId,
      'X-Session-Secret': request.data.sessionSecret
    },
    ...request.data
  }
}

module.exports = populateTestSession
