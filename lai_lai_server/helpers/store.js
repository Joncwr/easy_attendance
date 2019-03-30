const crypto = require('crypto')

function randomString () {
  return crypto.randomBytes(4).toString('hex')
}

module.exports = {
  saltHashPassword: ({
    password,
    salt = randomString()
  }) => {
    const hash = crypto
      .createHmac('sha512', salt)
      .update(password)
    return {
      salt,
      hash: hash.digest('hex')
    }
  },
  randomString: randomString,
}
