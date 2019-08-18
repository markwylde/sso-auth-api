const {cryptPassword} = require('../lib/services/crypt')

exports.up = async db => {
  const password = await cryptPassword('pass')

  return Promise.all([
    db.table('users').insert({
      id: 'genesis',
      username: 'genesis',
      password,
      perms: [
        'auth_admin:create',
        'auth_admin:read',
        'auth_admin:update',
        'auth_admin:delete'
      ],
      date_created: new Date()
    })
  ])
}

exports.down = db => {
  return Promise.all([
    db.table('users').filter({id: 'genesis'}).delete()
  ])
}
