const r = require('../../services/database')

const appLense = data => ({
  id: data.id,
  title: data.title,
  active: data.active,
  date_created: data.date_created,
  user_id: data.user_id,
  date_activated: data.date_activated,
  session_update_hook_url: data.session_update_hook_url
})

async function listApps ({ user }) {
  let apps

  if (user.perms.includes('sso:auth_admin:read')) {
    apps = await r.table('apps')
  } else {
    apps = await r.table('apps')
      .getAll(user.id, { index: 'user_id' })
  }

  return {
    status: 200,
    data: apps.map(appLense)
  }
}

module.exports = listApps
