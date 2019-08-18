const test = require('tape')
const crypt = require('../../../lib/services/crypt')

test('encrypted password contains salt', async function (t) {
  t.plan(1)

  const password = 'mytestpassword'
  const encrypted = await crypt.cryptPassword(password)

  t.equal(encrypted.includes('|'), true, 'should contain a pipe')
})

test('encrypt password with predefined salt', async function (t) {
  t.plan(1)

  const password = 'mytestpassword'
  const salt = 'examplessalt'
  const encrypted = await crypt.cryptPassword(password, salt)

  t.equal(encrypted, '1a8f1a137681a1903a613391e9baf515080be9b0c354f3c8b672cd9148eb59447879457975d4869a437e2fc280559dcd25fa1b9271cbff357382dca7f96721c7|examplessalt')
})

test('compare password with predefined salt', async function (t) {
  t.plan(1)

  const password = 'mytestpassword'
  const encryptedPassword = '1a8f1a137681a1903a613391e9baf515080be9b0c354f3c8b672cd9148eb59447879457975d4869a437e2fc280559dcd25fa1b9271cbff357382dca7f96721c7|examplessalt'

  const matched = await crypt.comparePassword(password, encryptedPassword)

  t.equal(matched, true, 'encrypted password matched plaintext')
})

test('compare password with wrong salt', async function (t) {
  t.plan(1)

  const password = 'mytestpassword'
  const encryptedPassword = '1a8f1a137681a1903a613391e9baf515080be9b0c354f3c8b672cd9148eb59447879457975d4869a437e2fc280559dcd25fa1b9271cbff357382dca7f96721c7|examplesWRONGsalt'

  const matched = await crypt.comparePassword(password, encryptedPassword)

  t.equal(matched, false, 'encrypted password did not matched plaintext')
})
