const r = require('../../services/database')

async function listPermissions () {
  const permissions = await r.table('permissions')

  return {
    status: 200,
    data: permissions
  }
}

module.exports = listPermissions
