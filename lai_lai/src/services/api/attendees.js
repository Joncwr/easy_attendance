const jwtMiddleware = require('../jwtMiddleware')

module.exports = {
  getAttendees: () => {
    return new Promise((resolve, reject) => {
      jwtMiddleware.jwtFetch('get', 'api/attendees/getAttendees')
      .then(res => {
        if (res) resolve(res)
        else reject(res)
      })
      .catch(err => reject(err))
    })
  },
  addAttendee: (user) => {
    return new Promise((resolve, reject) => {
      jwtMiddleware.jwtFetch('post', 'api/attendees/addAttendee', user)
      .then(res => {
        if (res) resolve(res)
        else reject(res)
      })
      .catch(err => reject(err))
    })
  },
  deleteAttendee: (name) => {
    return new Promise((resolve, reject) => {
      jwtMiddleware.jwtFetch('delete', 'api/attendees/deleteAttendee/' + name)
      .then(res => {
        if (res) resolve(res)
        else reject(res)
      })
      .catch(err => reject(err))
    })
  },
  attendance: (attendance) => {
    return new Promise((resolve, reject) => {
      jwtMiddleware.jwtFetch('put', 'api/attendees/attendance', attendance)
      .then(res => {
        if (res) resolve(res)
        else reject(res)
      })
      .catch(err => reject(err))
    })
  }
}
