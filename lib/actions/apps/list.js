const r = require('../../services/database')

const appLense = data => ({
  id: data.id,
  title: data.title,
  active: data.active,
  date_created: data.date_created
})


async function listApps ({user}) {
  const apps = await r.table('apps')
    .getAll(user.id, {index: 'user_id'})

  return {
    status: 200,
    data: apps.map(appLense)
  }
}

module.exports = listApps
