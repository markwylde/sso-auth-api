const r = require('../../services/database')

async function listPermissions ({ user }) {
  let permissions = []

  if (user) {
    const ownAppIds = (await r
      .table('apps')
      .getAll(user.id, { index: 'user_id' })
      .pluck('id')
    ).map(el => el.id)

    permissions = await r
      .table('permissions')
      .getAll(...ownAppIds, { index: 'app_id' })
  }

  return {
    status: 200,
    data: permissions
  }
}

module.exports = listPermissions
