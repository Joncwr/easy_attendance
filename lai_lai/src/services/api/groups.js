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
  editGroup: (groupDict) => {
    return new Promise((resolve, reject) => {
      jwtMiddleware.jwtFetch('put', 'api/groups/editGroup', groupDict)
      .then(res => {
        if (res) resolve(res)
        else reject(res)
      })
      .catch(err => reject(err))
    })
  },
  deleteGroup: (groupId) => {
    return new Promise((resolve, reject) => {
      jwtMiddleware.jwtFetch('delete', 'api/groups/deleteGroup/' + groupId)
      .then(res => {
        if (res) resolve(res)
        else reject(res)
      })
      .catch(err => reject(err))
    })
  },
}
