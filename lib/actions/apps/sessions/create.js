const r = require('../../../services/database')
const { createRandomString } = require('../../../services/crypt')

const { NotFound, Unauthorised } = require('generic-errors')

async function createSession ({ params, headers }) {
  const app = await r.table('apps')
    .get(params.appId)

  if (!app) {
    throw new NotFound()
  }

  if (app.secret !== headers['x-app-secret']) {
    throw new Unauthorised()
  }

  const sessionId = createRandomString(32)
  const sessionSecret = createRandomString(80)

  await r.table('sessions')
    .insert({
      id: sessionId,
      secret: sessionSecret,
      app_id: app.id,
      date_created: new Date()
    }, { returnChanges: true })

  return {
    status: 201,
    data: {
      sessionId,
      sessionSecret
    }
  }
}

module.exports = createSession
