const r = require('../../services/database')

const { NotFound } = require('generic-errors')

const appLense = data => ({
  id: data.id,
  title: data.title,
  active: data.active,
  date_created: data.date_created,
  user_id: data.user_id,
  delegations: data.delegations,
  date_activated: data.date_activated,
  session_update_hook_url: data.session_update_hook_url
})

async function readApp ({ params }) {
  const app = await r
    .table('apps')
    .get(params.id)

  if (app) {
    return {
      status: 200,
      data: appLense(app)
    }
  } else {
    throw new NotFound()
  }
}

module.exports = readApp
