const r = require('../../services/database')

const { NotFound } = require('generic-errors')

const filterByAllowedPermissions = require('../../services/filterByAllowedPermissions')

async function readCurrentSession ({ user, headers, cookies }) {
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

  if (session && session.app_id === 'sso' && session.secret === sessionSecret) {
    const user = await r
      .table('users')
      .get(session.user_id)

    const allowedPermissionsFilter = await filterByAllowedPermissions(session.user_id)

    return {
      status: 200,
      data: {
        id: session.id,
        username: user.username,
        perms: user.perms.filter(allowedPermissionsFilter)
      }
    }
  } else {
    throw new NotFound({
      message: ['session not found']
    })
  }
}

module.exports = readCurrentSession
