const jwtMiddleware = require('../jwtMiddleware')

module.exports = {
  getDate: () => {
    return new Promise((resolve, reject) => {
      jwtMiddleware.jwtFetch('get', 'api/date/getDate')
      .then(res => {
        if (res) resolve(res)
        else reject(res)
      })
      .catch(err => reject(err))
    })
  },
  updateDate: (dateDict) => {
    return new Promise((resolve, reject) => {
      jwtMiddleware.jwtFetch('put', 'api/date/updateDate', dateDict)
      .then(res => {
        if (res) resolve(res)
        else reject(res)
      })
      .catch(err => reject(err))
    })
  },
}
