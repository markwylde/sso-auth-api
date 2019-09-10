const r = require('../../services/database')

const { NotFound } = require('generic-errors')

async function deleteApp ({ params }) {
  const app = await r
    .table('apps')
    .get(params.id)

  if (app) {
    await r
    .table('apps')
    .get(params.id)
    .delete()

    return {
      status: 200
    }
  } else {
    throw new NotFound()
  }
}

module.exports = deleteApp
