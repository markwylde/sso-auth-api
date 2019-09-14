const r = require('../../../services/database')

const { Unauthorised, NotFound } = require('generic-errors')

const sessionLense = data => ({
  id: data.id,
  date_created: data.date_created
})

async function listSessions ({ params, user }) {
  const app = await r.table('apps')
    .get(params.appId)

  if (!app) {
    throw new NotFound()
  }

  if (!user || app.user_id !== user.id) {
    throw new Unauthorised()
  }

  const sessions = await r.table('sessions').filter({ app_id: app.id })

  return {
    status: 200,
    data: sessions.map(sessionLense)
  }
}

module.exports = listSessions
