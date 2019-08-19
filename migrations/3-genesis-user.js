const {cryptPassword} = require('../lib/services/crypt')

exports.up = async db => {
  const password = await cryptPassword('genesis')

  return Promise.all([
    db.table('users').insert({
      id: 'genesis',
      username: 'genesis',
      password,
      perms: [
        'sso:auth_admin:create',
        'sso:auth_admin:read',
        'sso:auth_admin:update',
        'sso:auth_admin:delete'
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
