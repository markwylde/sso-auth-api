const r = require('../../services/database')

const {NotFound} = require('generic-errors')

async function readUser ({params}) {
  const user = await r
    .table('users')
    .filter({ id: params.id })

  if (user[0]) {
    return {
      status: 200,
      data: {
        id: user[0].id,
        username: user[0].id
      }
    }
  } else {
    throw new NotFound()
  }
}

module.exports = readUser
