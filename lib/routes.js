const Route = require('route-parser')
const { getSessionInformation, checkPermission } = require('./services/auth')

const routes = [
  [
    'GET', new Route('/v1/apps'),
    getSessionInformation(),
    require('./actions/apps/list')
  ],

  [
    'GET', new Route('/v1/apps/:id'),
    getSessionInformation(),
    require('./actions/apps/read')
  ],

  [
    'GET', new Route('/v1/apps/:appId/sessions'),
    getSessionInformation(),
    require('./actions/apps/sessions/list')
  ],

  [
    'GET', new Route('/v1/apps/:appId/sessions/current'),
    require('./actions/apps/sessions/readCurrent')
  ],

  [
    'POST', new Route('/v1/apps'),
    getSessionInformation(),
    require('./actions/apps/create')
  ],

  [
    'POST', new Route('/v1/apps/:appId/sessions'),
    getSessionInformation(),
    require('./actions/apps/sessions/create')
  ],

  [
    'POST', new Route('/v1/apps/:id/activate'),
    getSessionInformation(),
    require('./actions/apps/activate')
  ],

  [
    'GET', new Route('/v1/users'),
    getSessionInformation(),
    checkPermission('sso:auth_admin:read'),
    require('./actions/users/list')
  ],

  [
    'GET', new Route('/v1/users/:id'),
    getSessionInformation(),
    checkPermission('sso:auth_admin:read'),
    require('./actions/users/read')
  ],

  [
    'POST', new Route('/v1/users'),
    getSessionInformation(),
    require('./actions/users/create')
  ],

  [
    'GET', new Route('/v1/sessions/current'),
    getSessionInformation(),
    require('./actions/sessions/readCurrent')
  ],

  // [
  //   'GET', new Route('/v1/sessions/:id'),
  //   getSessionInformation(),
  //   require('./actions/sessions/read')
  // ],

  [
    'POST', new Route('/v1/sessions'),
    getSessionInformation(),
    require('./actions/sessions/create')
  ],

  [
    'GET', new Route('/v1/permissions'),
    getSessionInformation(),
    require('./actions/permissions/list')
  ],

  [
    'GET', new Route('/v1/apps/:appId/permissions'),
    getSessionInformation(),
    require('./actions/apps/permissions/list')
  ],

  [
    'POST', new Route('/v1/apps/:appId/permissions'),
    getSessionInformation(),
    require('./actions/apps/permissions/create')
  ]
]

module.exports = routes
