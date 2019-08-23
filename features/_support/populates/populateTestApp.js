const chance = require('chance')()
const uuidv4 = require('uuid/v4')

const httpRequest = require('../httpRequest')

const url = `http://localhost:${process.env.PORT}/v1`

async function populateTestApp (opts) {
  const app = {
    id: uuidv4(),
    title: chance.word({ length: 15 }),
    ...opts
  }

  let appRequest = await httpRequest({
    url: `${url}/apps`,
    method: 'post',
    json: true,
    headers: opts && opts.session && opts.session.headers,
    data: app
  })

  const appSecret = appRequest.data.secret

  if (opts && opts.session) {
    await httpRequest({
      url: `${url}/apps/${appRequest.data.id}/activate`,
      method: 'post',
      json: true,
      headers: opts && opts.session && opts.session.headers
    })

    appRequest = await httpRequest({
      url: `${url}/apps/${appRequest.data.id}`,
      method: 'get',
      json: true,
      headers: opts && opts.session && opts.session.headers
    })
  }

  return {
    secret: appSecret,
    ...appRequest.data
  }
}

module.exports = populateTestApp
