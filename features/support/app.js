const test = require('tape')

const app = require('../../lib')
const db = require('../../lib/services/database')

test.onFinish(db.destroy)

module.exports = require('../../lib')
