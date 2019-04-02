const jwtMiddleware = require('../jwtMiddleware')

module.exports = {
  getEvent: (eventId) => {
    return new Promise((resolve, reject) => {
      jwtMiddleware.jwtFetch('get', 'publicapi/getEvent/' + eventId)
      .then(res => {
        if (res) resolve(res)
        else reject(res)
      })
      .catch(err => reject(err))
    })
  },
  getAttendee: (attendeeId) => {
    return new Promise((resolve, reject) => {
      jwtMiddleware.jwtFetch('get', 'publicapi/getAttendee/' + attendeeId)
      .then(res => {
        if (res) resolve(res)
        else reject(res)
      })
      .catch(err => reject(err))
    })
  },
  postAttendance: (attendanceDict) => {
    return new Promise((resolve, reject) => {
      jwtMiddleware.jwtFetch('post', 'publicapi/attendance', attendanceDict)
      .then(res => {
        if (res) resolve(res)
        else reject(res)
      })
      .catch(err => reject(err))
    })
  },
}
