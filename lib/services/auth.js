const {Unauthorised} = require('generic-errors')
const r = require('./database')

async function getSessionInformation ({headers}) {
  if (!headers['x-session-id']) {
    return {}
  }

  const session = await r
    .table('sessions')
    .get(headers['x-session-id'])

  if (session && session.secret === headers['x-session-secret']) {
    const user = await r
      .table('users')
      .get(session.user_id)

    return {session, user}
  }

  return {}
}

function checkPermission (permission) {
  return function ({user}) {
    // console.log(user)
    if (!user || !user.perms.includes(permission)) {
      throw new Unauthorised()
    }
  }
}

module.exports = {
  getSessionInformation,
  checkPermission
}
