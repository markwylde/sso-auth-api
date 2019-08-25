const r = require('../../services/database')

const { NotFound, Unauthorised, Unprocessable } = require('generic-errors')

async function activateSession ({ params, user, query, session }) {
  if (!session) {
    throw new Unauthorised()
  }

  const mySession = await r.table('sessions')
    .get(session.id)

  if (!mySession) {
    throw new Unauthorised()
  }

  const appSession = await r.table('sessions')
    .get(query.searchParams.get('sessionId'))

  if (!appSession) {
    throw new NotFound()
  }

  if (appSession.user_id) {
    throw new Unprocessable({ message: 'Session has already been activated' })
  }

  await r.table('sessions')
    .get(appSession.id)
    .update({
      user_id: user.id,
      date_activated: new Date()
    }, { returnChanges: true })

  return {
    status: 200
  }
}

module.exports = activateSession
