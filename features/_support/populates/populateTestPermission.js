const chance = require('chance')()
const httpRequest = require('../httpRequest')

const url = `http://localhost:${process.env.PORT}/v1`

async function populateTestPermission (opts) {
  try {
    const permission = {
      permission: chance.word({ length: 15 }),
      title: chance.word({ length: 15 }),
      description: chance.paragraph({ sentences: 1 }),
      group: chance.word({ length: 15 }),

      ...opts
    }

    const request = await httpRequest({
      url: `${url}/apps/${opts.app.id}/permissions`,
      method: 'post',
      json: true,
      headers: opts && opts.session && {
        'X-Session-Id': opts.session.sessionId,
        'X-Session-Secret': opts.session.sessionSecret
      },
      data: permission
    })

    return request.data
  } catch (error) {
    console.log(`\nError in test populator '${__filename}'`)
    throw error
  }
}

module.exports = populateTestPermission
