const r = require('../../services/database')

const { NotFound } = require('generic-errors')

async function readSession ({ params }) {
  const session = await r
    .table('sessions')
    .get(params.id)

  if (session) {
    return {
      status: 200,
      data: session
    }
  } else {
    throw new NotFound({
      message: ['session not found']
    })
  }
}

module.exports = readSession
