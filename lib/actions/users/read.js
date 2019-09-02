const r = require('../../services/database')

const { NotFound } = require('generic-errors')

const filterByAllowedPermissions = require('../../services/filterByAllowedPermissions')

async function readUser ({ user, params }) {
  const allowedPermissionsFilter = await filterByAllowedPermissions(user.id)

  const currentUser = await r
    .table('users')
    .get(params.id)

  if (currentUser) {
    return {
      status: 200,
      data: {
        id: currentUser.id,
        username: currentUser.username,
        perms: currentUser.perms.filter(allowedPermissionsFilter),
        date_created: currentUser.date_created
      }
    }
  } else {
    throw new NotFound()
  }
}

module.exports = readUser
