const uuidv4 = require('uuid/v4')
const db = require('../../lib/services/database')

async function setupTestUserWithSession ({ username, permissions } = {}) {
  const userId = uuidv4()
  const sessionId = uuidv4()

  await db.table('users').insert({
    id: userId,
    username: uuidv4(),
    password: `testpass`,
    perms: permissions || [],
    date_created: new Date()
  })

  await db.table('sessions').insert({
    id: sessionId,
    secret: `testsessionsecret`,
    user_id: userId,
    date_created: new Date()
  })

  return {
    'x-session-id': sessionId,
    'x-session-secret': 'testsessionsecret'
  }
}

module.exports = setupTestUserWithSession
