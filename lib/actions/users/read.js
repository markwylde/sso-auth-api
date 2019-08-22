const r = require('../../services/database')

const { NotFound } = require('generic-errors')

async function readUser ({ params }) {
  const user = await r
    .table('users')
    .get(params.id)

  if (user) {
    return {
      status: 200,
      data: {
        id: user.id,
        username: user.id,
        perms: user.perms || []
      }
    }
  } else {
    throw new NotFound()
  }
}

module.exports = readUser
