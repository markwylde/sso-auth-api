const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const uuidv4 = require('uuid/v4')

const r = require('../../services/database')
const validate = require('../../services/schemaValidator')
const { createRandomString } = require('../../services/crypt')

const { Unprocessable } = require('generic-errors')

const appLense = data => ({
  id: data.id,
  secret: data.secret,
  title: data.title,
  active: data.active,
  delegations: data.delegations,
  activation_url: `${process.env.APP_PUBLIC_URL}/apps/${data.id}/activate`,
  session_update_hook_url: data.session_update_hook_url,
  date_created: data.date_created
})

const newAppSchema =
  yaml.safeLoad(fs.readFileSync(path.resolve(__dirname, '../../schemas/newApp.yml'), 'utf8'))

async function createApp ({ body }) {
  const validation = validate(newAppSchema, body || {})
  if (!validation.isValid) {
    throw new Unprocessable({ message: validation.friendly })
  }

  const existingApp = await r
    .table('apps')
    .getAll(body.title, { index: 'title' })

  if (existingApp[0]) {
    throw new Unprocessable({
      message: { title: `'${body.title}' already exists` }
    })
  }

  const insertResult = await r.table('apps')
    .insert({
      id: uuidv4(),
      secret: createRandomString(80),
      title: body.title,
      session_update_hook_url: body.session_update_hook_url,
      delegations: body.delegations,
      active: false,
      date_created: new Date()
    }, { returnChanges: true })

  const app = insertResult.changes[0].new_val

  return {
    status: 201,
    data: appLense(app)
  }
}

module.exports = createApp
