const httpRequest = require('../httpRequest')

const url = `http://localhost:${process.env.PORT}/v1`

async function populateTestSession (opts) {
  try {
    const request = await httpRequest({
      url: `${url}/sessions`,
      method: 'post',
      json: true,
      data: opts
    })

    return {
      headers: {
        'X-Session-Id': request.data.sessionId,
        'X-Session-Secret': request.data.sessionSecret
      },
      ...request.data
    }
  } catch (error) {
    console.log(`\nError in test populator '${__filename}'`)
    throw error
  }
}

module.exports = populateTestSession
