const r = require('../../services/database')

const { NotFound } = require('generic-errors')

const appLense = data => ({
  id: data.id,
  secret: data.secret,
  title: data.title,
  active: data.active,
  activation_url: `${process.env.APP_PUBLIC_URL}/apps/${data.id}/activate`,
  date_created: data.date_created
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
