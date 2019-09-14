const r = require('./database')

async function filterByAllowedPermissions (userId) {
  let allowedPermissions = []
  if (userId) {
    const ownAppIds = (await r
      .table('apps')
      .getAll(userId, { index: 'user_id' })
      .pluck('id')
    ).map(el => el.id)

    allowedPermissions = await r
      .table('permissions')
      .getAll(...ownAppIds.concat(['sso']), { index: 'app_id' })
  }

  return perm => allowedPermissions.find(p => p.id === perm)
}

module.exports = filterByAllowedPermissions
