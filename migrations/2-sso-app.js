module.exports = {
  up: async db => {
    return Promise.all([
      db.table('apps').insert({
        id: 'sso',
        title: 'Authentication',
        date_created: new Date(),
        user_id: 'genesis',
        active: true
      }),
      db.table('permissions').insert({
        id: 'sso:auth_admin:create',
        app_id: 'sso',
        permission: 'auth_admin:create',
        title: 'Administration - Create',
        description: 'Create entities in the auth administration',
        group: 'Admin',
        date_created: new Date()
      }),
      db.table('permissions').insert({
        id: 'sso:auth_admin:read',
        app_id: 'sso',
        permission: 'auth_admin:read',
        title: 'Administration - Read',
        description: 'Read entities in the auth administration',
        group: 'Admin',
        date_created: new Date()
      }),
      db.table('permissions').insert({
        id: 'sso:auth_admin:update',
        app_id: 'sso',
        permission: 'auth_admin:update',
        title: 'Administration - Update',
        description: 'Update entities in the auth administration',
        group: 'Admin',
        date_created: new Date()
      }),
      db.table('permissions').insert({
        id: 'sso:auth_admin:delete',
        app_id: 'sso',
        permission: 'auth_admin:delete',
        title: 'Administration - Delete',
        description: 'Delete entities in the auth administration',
        group: 'Admin',
        date_created: new Date()
      }),
      db.table('permissions').insert({
        id: 'sso:app:authorise',
        app_id: 'sso',
        permission: 'app:authorise',
        title: 'Apps - Authorise',
        description: 'Authorise and associate apps to your account',
        group: 'Admin',
        date_created: new Date()
      })
    ])
  },

  down: db => {
    return Promise.all([
      db.table('apps').get('sso').delete(),
      db.table('permissions').get('sso:auth_admin:create').delete(),
      db.table('permissions').get('sso:auth_admin:read').delete(),
      db.table('permissions').get('sso:auth_admin:update').delete(),
      db.table('permissions').get('sso:auth_admin:delete').delete(),
      db.table('permissions').get('sso:app:authorise').delete()
    ])
  }
}
