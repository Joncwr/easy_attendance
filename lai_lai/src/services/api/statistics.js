const jwtMiddleware = require('../jwtMiddleware')

module.exports = {
  getPast5Events: (groupId) => {
    return new Promise((resolve, reject) => {
      jwtMiddleware.jwtFetch('get', 'api/statistics/past5Events/' + groupId)
      .then(res => {
        if (res) resolve(res)
        else reject(res)
      })
      .catch(err => reject(err))
    })
  },
  getAllAttendance: (groupId) => {
    return new Promise((resolve, reject) => {
      jwtMiddleware.jwtFetch('get', 'api/statistics/getAllAttendance/' + groupId)
      .then(res => {
        if (res) resolve(res)
        else reject(res)
      })
      .catch(err => reject(err))
    })
  },
}
