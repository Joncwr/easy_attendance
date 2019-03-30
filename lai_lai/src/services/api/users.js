const jwtMiddleware = require('../jwtMiddleware')

module.exports = {
  getUser: (userId) => {
    return new Promise((resolve, reject) => {
      jwtMiddleware.jwtFetch('get', 'api/users/getUser/' + userId)
      .then(res => {
        if (res) resolve(res)
        else reject(res)
      })
      .catch(err => reject(err))
    })
  },
}
