const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')

const r = require('../../services/database')
const validate = require('../../services/schemaValidator')

const { Unprocessable } = require('generic-errors')

const newPermissionSchema =
  yaml.safeLoad(fs.readFileSync(path.resolve(__dirname, '../../schemas/newPermission.yml'), 'utf8'))

async function createPermission ({ body }) {
  const validation = validate(newPermissionSchema, body || {})
  if (!validation.isValid) {
    throw new Unprocessable({ message: validation.friendly })
  }

  const existingPermission = await r
    .table('permissions')
    .get(`${body.app_id}:${body.permission}`)

  if (existingPermission) {
    throw new Unprocessable({
      message: { id: `'${body.app_id}:${body.permission}' already exists` }
    })
  }

  const permission = await r.table('permissions')
    .insert({
      id: `${body.app_id}:${body.permission}`,
      app_id: body.app_id,
      permission: body.permission,
      title: body.title,
      description: body.description,
      group: body.group,
      date_created: new Date()
    }, { returnChanges: true })

  return {
    status: 201,
    data: permission.changes[0].new_val
  }
}

module.exports = createPermission
