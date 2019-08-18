const crypto = require('crypto')

function createRandomString (length) {
  return crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length)
}

function cryptPassword (password, salt) {
  return new Promise((resolve, reject) => {
    salt = salt || createRandomString(32)
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) {
        return reject(err)
      }

      resolve(`${derivedKey.toString('hex')}|${salt}`)
    })
  })
}

async function comparePassword (plainPass, hashword) {
  const hashwordSplit = hashword.split('|')
  const salt = hashwordSplit[1]

  const encryptedPassword = await cryptPassword(plainPass, salt)

  return encryptedPassword === hashword
}

module.exports = {
  createRandomString,
  cryptPassword,
  comparePassword
}
