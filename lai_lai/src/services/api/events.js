const jwtMiddleware = require('../jwtMiddleware')

module.exports = {
  updateEvent: (eventDict) => {
    return new Promise((resolve, reject) => {
      jwtMiddleware.jwtFetch('put', 'api/events/updateEvent', eventDict)
      .then(res => {
        if (res) resolve(res)
        else reject(res)
      })
      .catch(err => reject(err))
    })
  },

  createEvent: (eventDict) => {
    return new Promise((resolve, reject) => {
      jwtMiddleware.jwtFetch('post', 'api/events/createEvent', eventDict)
      .then(res => {
        if (res) resolve(res)
        else reject(res)
      })
      .catch(err => reject(err))
    })
  },
}
