const jwtMiddleware = require('../jwtMiddleware')

module.exports = {
  createGroup: (groupDict) => {
    return new Promise((resolve, reject) => {
      jwtMiddleware.jwtFetch('post', 'api/groups/createGroup', groupDict)
      .then(res => {
        if (res) resolve(res)
        else reject(res)
      })
      .catch(err => reject(err))
    })
  },
}
