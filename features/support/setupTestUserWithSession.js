const db = require('../../lib/services/database')

async function setupTestUserWithSession ({permissions} = {}) {
  const existingUser = await db.table('users').get('testuser')

  if (existingUser) {
    await db.table('users').get('testuser').delete()
  }

  await db.table('users').insert({
    id: `testuser`,
    username: `testuser`,
    password: `testpass`,
    perms: permissions || [],
    date_created: new Date()
  })

  await db.table('sessions').insert({
    id: `testsessionid`,
    secret: `testsessionsecret`,
    user_id: `testuser`,
    date_created: new Date()
  })

  return {
    'x-session-id': 'testsessionid',
    'x-session-secret': 'testsessionsecret'
  }
}

module.exports = setupTestUserWithSession
