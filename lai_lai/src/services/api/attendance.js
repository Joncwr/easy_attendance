const jwtMiddleware = require('../jwtMiddleware')

module.exports = {
  getAttendance: (eventId) => {
    return new Promise((resolve, reject) => {
      jwtMiddleware.jwtFetch('get', 'api/attendance/getAttendance/' + eventId)
      .then(res => {
        if (res) resolve(res)
        else reject(res)
      })
      .catch(err => reject(err))
    })
  },
  updateAttendance: (updateAttendanceDict) => {
    return new Promise((resolve, reject) => {
      jwtMiddleware.jwtFetch('put', 'api/attendance/updateAttendance', updateAttendanceDict)
      .then(res => {
        if (res) resolve(res)
        else reject(res)
      })
      .catch(err => reject(err))
    })
  },
}
