const Route = require('route-parser')
const {getSessionInformation, checkPermission} = require('./services/auth')

const routes = [
  [
    'GET', new Route('/v1/users'),
    getSessionInformation(),
    checkPermission('sso:auth_admin:read'),
    require('./actions/users/list')
  ],

  [
    'GET', new Route('/v1/users/:id'),
    getSessionInformation(),
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

  [
    'GET', new Route('/v1/sessions/:id'),
    getSessionInformation(),
    require('./actions/sessions/read')
  ],

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
    'POST', new Route('/v1/permissions'),
    getSessionInformation(),
    require('./actions/permissions/create')
  ]
]

module.exports = routes
