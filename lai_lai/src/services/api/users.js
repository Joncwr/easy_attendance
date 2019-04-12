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
  setDefaultGroup: (defaultGroupDict) => {
    return new Promise((resolve, reject) => {
      jwtMiddleware.jwtFetch('put', 'api/users/setDefaultGroup', defaultGroupDict)
      .then(res => {
        if (res) resolve(res)
        else reject(res)
      })
      .catch(err => reject(err))
    })
  },
  setTags: (setTagsDict) => {
    return new Promise((resolve, reject) => {
      jwtMiddleware.jwtFetch('put', 'api/users/setTags', setTagsDict)
      .then(res => {
        if (res) resolve(res)
        else reject(res)
      })
      .catch(err => reject(err))
    })
  },
}
