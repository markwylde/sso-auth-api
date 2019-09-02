const { Unauthorised } = require('generic-errors')
const r = require('./database')

const filterByAllowedPermissions = require('./filterByAllowedPermissions')

function getSessionInformation () {
  return async function ({ headers, cookies }) {
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
      const currentUser = await r
        .table('users')
        .get(session.user_id)

      const allowedPermissionsFilter = await filterByAllowedPermissions(session.user_id)

      const currentUserObj = {
        id: currentUser.id,
        username: currentUser.username,
        perms: currentUser.perms.filter(allowedPermissionsFilter)
      }

      return {
        session,
        user: currentUserObj
      }
    }

    return {}
  }
}

function checkPermission (permission) {
  return function ({ user }) {
    if (!user || !user.perms.includes(permission)) {
      throw new Unauthorised()
    }

    return {}
  }
}

module.exports = {
  getSessionInformation,
  checkPermission
}
