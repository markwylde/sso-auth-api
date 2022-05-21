const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const uuidv4 = require('uuid').v4

const r = require('../../services/database')
const validate = require('../../services/schemaValidator')
const { cryptPassword } = require('../../services/crypt')

const { Unprocessable } = require('generic-errors')

const newUserSchema =
  yaml.load(fs.readFileSync(path.resolve(__dirname, '../../schemas/newUser.yml'), 'utf8'))

const userLense = data => ({
  id: data.id,
  username: data.username,
  date_created: data.date_created
})

async function createUser ({ body }) {
  const validation = validate(newUserSchema, body || {})
  if (!validation.isValid) {
    throw new Unprocessable({ message: validation.friendly })
  }

  if (body.password !== body.password_confirmation) {
    throw new Unprocessable({
      message: { password: 'password and confirmation password did not match' }
    })
  }

  const existingUser = await r
    .table('users')
    .getAll(body.username.toLowerCase(), { index: 'username' })

  if (existingUser[0]) {
    throw new Unprocessable({
      message: { username: `'${body.username.toLowerCase()}' already exists` }
    })
  }

  const password = await cryptPassword(body.password)

  const insertedRecord = await r.table('users')
    .insert({
      id: uuidv4(),
      username: body.username.toLowerCase(),
      password,
      perms: [],
      date_created: new Date()
    }, { returnChanges: true })

  const user = insertedRecord.changes[0].new_val

  return {
    status: 201,
    data: userLense(user)
  }
}

module.exports = createUser
