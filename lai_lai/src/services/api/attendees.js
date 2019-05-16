const jwtMiddleware = require('../jwtMiddleware')

module.exports = {
  getAttendees: (group_id) => {
    return new Promise((resolve, reject) => {
      jwtMiddleware.jwtFetch('get', 'api/attendees/getAttendees/' + group_id)
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
  deleteAttendee: (id) => {
    return new Promise((resolve, reject) => {
      jwtMiddleware.jwtFetch('delete', 'api/attendees/deleteAttendee/' + id)
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
  },
  editAttendee: (attendee) => {
    return new Promise((resolve, reject) => {
      jwtMiddleware.jwtFetch('put', 'api/attendees/editAttendee', attendee)
      .then(res => {
        if (res) resolve(res)
        else reject(res)
      })
      .catch(err => reject(err))
    })
  },
  getRequestedAttendees: (groupId) => {
    return new Promise((resolve, reject) => {
      jwtMiddleware.jwtFetch('get', 'api/attendees/getRequestedAttendees/' + groupId)
      .then(res => {
        if (res) resolve(res)
        else reject(res)
      })
      .catch(err => reject(err))
    })
  },
}
