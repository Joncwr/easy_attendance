const jwtMiddleware = require('../jwtMiddleware')

module.exports = {
  getEvent: (eventId) => {
    return new Promise((resolve, reject) => {
      jwtMiddleware.publicFetch('get', 'publicapi/getEvent/' + eventId)
      .then(res => {
        if (res) resolve(res)
        else reject(res)
      })
      .catch(err => reject(err))
    })
  },
  getAttendee: (attendeeId) => {
    return new Promise((resolve, reject) => {
      jwtMiddleware.publicFetch('get', 'publicapi/getAttendee/' + attendeeId)
      .then(res => {
        if (res) resolve(res)
        else reject(res)
      })
      .catch(err => reject(err))
    })
  },
  getAttendees: (groupId) => {
    return new Promise((resolve, reject) => {
      jwtMiddleware.publicFetch('get', 'publicapi/getAttendees/' + groupId)
      .then(res => {
        if (res) resolve(res)
        else reject(res)
      })
      .catch(err => reject(err))
    })
  },
  postAttendance: (attendanceDict) => {
    return new Promise((resolve, reject) => {
      jwtMiddleware.publicFetch('post', 'publicapi/attendance', attendanceDict)
      .then(res => {
        if (res) resolve(res)
        else reject(res)
      })
      .catch(err => reject(err))
    })
  },
  requestAddAttendee: (groupId, requestAddAttendeeDict) => {
    return new Promise((resolve, reject) => {
      jwtMiddleware.publicFetch('post', 'publicapi/request_add_attendee/' + groupId, requestAddAttendeeDict)
      .then(res => {
        if (res) resolve(res)
        else reject(res)
      })
      .catch(err => reject(err))
    })
  },
  addTestimonial: (attendeeId, testimonial) => {
    return new Promise((resolve, reject) => {
      jwtMiddleware.publicFetch('post', 'publicapi/addTestimonial/' + attendeeId, testimonial)
      .then(res => {
        if (res) resolve(res)
        else reject(res)
      })
      .catch(err => reject(err))
    })
  },
}
