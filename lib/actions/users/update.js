const router = require('express').Router()

const r = require('../../services/database')
const { checkPerm } = require('../../services/jwt')
const { NotFoundError, SchemaValidationError } = require('../../services/errors')
const validator = require('../../services/json-schema')()

async function validatePermissions (perms) {
  if (perms && perms.length > 0) {
    const permissions = await r.table('permissions').getField('id')

    const unknownPermissions = perms.filter(p => !permissions.includes(p))

    if (unknownPermissions.length > 0) {
      throw new SchemaValidationError([{
        message: `Unknown permissions ${unknownPermissions.join(', ')}`
      }])
    }
  }
}

const getUser = async userId =>
  (await r
    .table('users')
    .filter({
      id: userId
    })
  )[0]

router.put('/users/:userId', checkPerm(/^auth_admin:update$/), async (req, res, next) => {
  try {
    validator.update_user.validate(req.body)

    req.body.perms = Array.isArray(req.body.perms) ? req.body.perms : [req.body.perms]
    await validatePermissions(req.body.perms)

    const user = await getUser(req.params.userId)

    if (user) {
      await r
        .table('users')
        .filter({
          id: req.params.userId
        })
        .update(req.body, { returnChanges: true })

      const userRefreshed = await getUser(req.params.userId)

      res.json(userRefreshed)
    } else {
      throw new NotFoundError()
    }
  } catch (err) {
    next(err)
  }
})

module.exports = router
