const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')

const r = require('../../services/database')
const validate = require('../../services/schemaValidator')
const { comparePassword, createRandomString } = require('../../services/crypt')

const {NotFound} = require('generic-errors')

async function readSession ({headers}) {
  const session = await r
    .table('sessions')
    .filter({
      id: headers['x-session-id'],
      secret: headers['x-session-secret']
    })

  if (session[0]) {
    return {
      status: 200,
      data: {
        id: session[0].id,
        user: session[0].user,
        perms: []
      }
    }
  } else {
    throw new NotFound({
      message: ['session not found']
    })
  }
}

module.exports = readSession
