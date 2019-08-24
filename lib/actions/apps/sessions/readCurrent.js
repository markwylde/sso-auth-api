const r = require('../../../services/database')

const { NotFound, Unauthorised } = require('generic-errors')

async function readCurrentSession ({ params, headers, cookies }) {
  let sessionId
  let sessionSecret

  if (headers['x-session-id']) {
    sessionId = headers['x-session-id']
    sessionSecret = headers['x-session-secret']
  } else if (cookies['sessionId']) {
    sessionId = cookies['sessionId']
    sessionSecret = cookies['sessionSecret']
  } else {
    throw new NotFound({
      message: ['session not found']
    })
  }

  const session = await r
    .table('sessions')
    .get(sessionId)

  if (session && session.app_id === params.appId && session.secret === sessionSecret) {
    const app = await r
      .table('apps')
      .get(session.app_id)

    if (app.secret !== headers['x-app-secret']) {
      throw new Unauthorised({ message: 'X-Session-Secret must be provided' })
    }

    let user = {}
    if (session.user_id) {
      user = await r
        .table('users')
        .get(session.user_id)

    }

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
