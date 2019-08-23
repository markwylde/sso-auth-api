const chance = require('chance')()
const uuidv4 = require('uuid/v4')

const { cryptPassword } = require('../../../lib/services/crypt')
const db = require('../../../lib/services/database')

async function populateTestUser (opts) {
  const user = {
    id: uuidv4(),
    username: chance.word({ length: 15 }),
    password: chance.word({ length: 15 }),
    perms: [],
    date_created: new Date(),
    ...opts
  }

  await db.table('users').insert({
    ...user,
    password: await cryptPassword(user.password)
  })

  return user
}

module.exports = populateTestUser
