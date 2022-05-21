const chance = require('chance')()
const uuidv4 = require('uuid').v4

const httpRequest = require('../httpRequest')
const db = require('../../../lib/services/database')
const ssoMigrations = require('../../../migrations/2-sso-app')

const url = `http://localhost:${process.env.PORT}/v1`

async function populateSSOApp (opts) {
  const existingSso = await db.table('apps').get('sso')
  if (existingSso) {
    return
  }

  await ssoMigrations.up(db)

  const app = {
    id: 'sso',
    title: 'SSO',
    user_id: opts.user_id,
    date_created: new Date(),
    active: true,
    ...opts
  }

  return db.table('apps').get('sso').update({user_id: opts.user_id})
}

async function populateTestApp (opts={}) {
  try {
    if (opts.owner) {
      await populateSSOApp({ user_id: opts.owner.id })
    }

    const app = {
      id: uuidv4(),
      title: opts.title || chance.word({ length: 15 }),
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
  } catch (error) {
    console.log(`\nError in test populator '${__filename}'`)
    throw error
  }
}

module.exports = populateTestApp
