const Route = require('route-parser')

const routes = [
  ['GET', new Route('/v1/users'), require('./actions/users/list')],
  ['GET', new Route('/v1/users/:id'), require('./actions/users/read')],
  ['POST', new Route('/v1/users'), require('./actions/users/create')],
  // ['PUT', new Route('/users/:userId'), require('./actions/users/update')],
  ['GET', new Route('/v1/sessions/:id'), require('./actions/sessions/read')],
  ['POST', new Route('/v1/sessions'), require('./actions/sessions/create')]
]

module.exports = routes
