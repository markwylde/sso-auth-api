const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')

const r = require('../../services/database')
const validate = require('../../services/schemaValidator')
const { cryptPassword } = require('../../services/crypt')

const {Unprocessable} = require('generic-errors')

const newUserSchema =
  yaml.safeLoad(fs.readFileSync(path.resolve(__dirname, '../../schemas/newUser.yml'), 'utf8'))

async function createUser ({body}) {
  const validation = validate(newUserSchema, body || {})
  if (!validation.isValid) {
    throw new Unprocessable({message: validation.friendly})
  }

  const existingUser = await r
    .table('users')
    .get(body.username)

  if (existingUser) {
    throw new Unprocessable({
      message: { user: `'${body.username}' already exists` }
    })
  }

  const password = await cryptPassword(body.password)

  const user = await r.table('users')
    .insert({
      id: body.username,
      username: body.username,
      password,
      perms: [],
      date_created: new Date()
    }, { returnChanges: true })

  return {
    status: 201,
    data: user.changes[0].new_val
  }
}

module.exports = createUser
