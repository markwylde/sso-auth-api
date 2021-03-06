const r = require('../../services/database')

const { NotFound, Unauthorised } = require('generic-errors')

async function activateApp ({ params, user }) {
  if (!user) {
    throw new Unauthorised()
  }

  if (!user.perms.includes('sso:app:authorise') && !user.perms.includes('sso:auth_admin:update')) {
    throw new Unauthorised()
  }

  const existingApp = await r
    .table('apps')
    .get(params.id)

  if (!existingApp) {
    throw new NotFound()
  }

  const insertResult = await r.table('apps')
    .get(existingApp.id)
    .update({
      active: true,
      user_id: user.id,
      date_activated: new Date()
    }, { returnChanges: true })

  const app = insertResult.changes[0].new_val

  return {
    status: 200,
    data: app
  }
}

module.exports = activateApp
