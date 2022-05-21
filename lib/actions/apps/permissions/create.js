const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')

const r = require('../../../services/database')
const validate = require('../../../services/schemaValidator')

const { Unprocessable } = require('generic-errors')

const newPermissionSchema =
  yaml.load(fs.readFileSync(path.resolve(__dirname, '../../../schemas/newPermission.yml'), 'utf8'))

const permissionLense = data => ({
  id: data.id,
  permission: data.permission,
  title: data.title,
  description: data.description,
  group: data.group,
  date_created: data.date_created
})

async function createPermission ({ body, params }) {
  const validation = validate(newPermissionSchema, body || {})
  if (!validation.isValid) {
    throw new Unprocessable({ message: validation.friendly })
  }

  const existingPermission = await r
    .table('permissions')
    .get(`${params.appId}:${body.permission}`)

  if (existingPermission) {
    throw new Unprocessable({
      message: { id: `'${params.appId}:${body.permission}' already exists` }
    })
  }

  let permission = await r.table('permissions')
    .insert({
      id: `${params.appId}:${body.permission}`,
      app_id: params.appId,
      permission: body.permission,
      title: body.title,
      description: body.description,
      group: body.group,
      date_created: new Date()
    }, { returnChanges: true })

  permission = permission.changes[0].new_val

  return {
    status: 201,
    data: permissionLense(permission)
  }
}

module.exports = createPermission
