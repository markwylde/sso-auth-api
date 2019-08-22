const r = require('../../services/database')

const { NotFound } = require('generic-errors')

async function readCurrentSession ({ headers, cookies }) {
  let sessionId
  let sessionSecret

  if (headers['x-session-id']) {
    sessionId = headers['x-session-id']
    sessionSecret = headers['x-session-secret']
  } else if (cookies['sessionId']) {
    sessionId = cookies['sessionId']
    sessionSecret = cookies['sessionSecret']
  } else {
    return {}
  }

  const session = await r
    .table('sessions')
    .get(sessionId)

  if (session && session.secret === sessionSecret) {
    const user = await r
      .table('users')
      .get(session.user_id)

    return {
      status: 200,
      data: {
        id: session.id,
        username: session.user_id,
        perms: user.perms || []
      }
    }
  } else {
    throw new NotFound({
      message: ['session not found']
    })
  }
}

module.exports = readCurrentSession
