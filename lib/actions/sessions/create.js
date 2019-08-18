const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')

const r = require('../../services/database')
const validate = require('../../services/schemaValidator')
const { comparePassword, createRandomString } = require('../../services/crypt')

const {Unprocessable, Unauthorised} = require('generic-errors')

const newSessionSchema =
  yaml.safeLoad(fs.readFileSync(path.resolve(__dirname, '../../schemas/newSession.yml'), 'utf8'))

async function createSession ({body}) {
  const validation = validate(newSessionSchema, body || {})
  if (!validation.isValid) {
    throw new Unprocessable({message: validation.friendly})
  }

  const user = await r
    .table('users')
    .filter({ id: body.username })

  if (user[0]) {
    const passwordMatched = await comparePassword(body.password, user[0].password)

    if (!passwordMatched) {
      throw new Unauthorised({
        message: ['username and password combination could not be found']
      })
    } else {
      const sessionId = createRandomString(32)
      const sessionSecret = createRandomString(80)

      await r.table('sessions')
        .insert({
          id: sessionId,
          secret: sessionSecret,
          user: user[0].id,
          date_created: new Date()
        }, { returnChanges: true })

      return {
        status: 201,
        data: {
          sessionId,
          sessionSecret
        }
      }
    }
  } else {
    throw new Unauthorised({
      message: ['username and password combination could not be found']
    })
  }
}

module.exports = createSession
