const uuidv4 = require('uuid/v4')
const db = require('../../lib/services/database')

async function setupTestUserWithSession ({permissions} = {}) {
  const existingUser = await db.table('users').get('testuser')

  if (existingUser) {
    await db.table('users').get('testuser').delete()
  }

  const userId = uuidv4()

  await db.table('users').insert({
    id: userId,
    username: `testuser`,
    password: `testpass`,
    perms: permissions || [],
    date_created: new Date()
  })

  await db.table('sessions').insert({
    id: `testsessionid`,
    secret: `testsessionsecret`,
    user_id: userId,
    date_created: new Date()
  })

  return {
    'x-session-id': 'testsessionid',
    'x-session-secret': 'testsessionsecret'
  }
}

module.exports = setupTestUserWithSession
