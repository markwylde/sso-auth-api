const r = require('../../services/database')

async function listUsers () {
  const users = await r.table('users')

  const usersLense = users
    .map(user => {
      delete user.password
      return user
    })

  return {
    status: 200,
    data: usersLense
  }
}

module.exports = listUsers
