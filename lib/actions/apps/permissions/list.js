const r = require('../../../services/database')

const permissionLense = data => ({
  id: data.id,
  permission: data.permission,
  title: data.title,
  description: data.description,
  group: data.group,
  date_created: data.date_created
})

async function listPermissions ({ params }) {
  const permissions = await r.table('permissions')
    .filter({ app_id: params.appId })

  return {
    status: 200,
    data: permissions.map(permissionLense)
  }
}

module.exports = listPermissions
