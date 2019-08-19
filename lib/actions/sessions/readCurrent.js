const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')

const r = require('../../services/database')
const validate = require('../../services/schemaValidator')
const { comparePassword, createRandomString } = require('../../services/crypt')

const {NotFound} = require('generic-errors')

async function readCurrentSession ({headers}) {
  const session = await r
    .table('sessions')
    .get(headers['x-session-id'])

  if (session && session.secret === headers['x-session-secret']) {
    const user = await r
      .table('users')
      .get(session.user_id)

    return {
      status: 200,
      data: {
        id: session.id,
        username: session.user_id,
        perms: user.perms || []
      }
    }
  } else {
    throw new NotFound({
      message: ['session not found']
    })
  }
}

module.exports = readCurrentSession
