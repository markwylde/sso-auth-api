const r = require('../../services/database')

const filterByAllowedPermissions = require('../../services/filterByAllowedPermissions')

async function listUsers ({user}) {
  const users = await r.table('users')

  const allowedPermissionsFilter = await filterByAllowedPermissions(user.id)

  const usersLense = users
    .map(user => ({
      id: user.id,
      username: user.username,
      perms: user.perms.filter(allowedPermissionsFilter),
      date_created: user.date_created
    }))

  return {
    status: 200,
    data: usersLense
  }
}

module.exports = listUsers
