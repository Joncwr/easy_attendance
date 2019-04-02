let axios = require('axios')

module.exports = {
  getEvent: (eventId) => {
    return new Promise((resolve, reject) => {
      axios.get(process.env.REACT_APP_SERVER + 'publicapi/getEvent/' + eventId)
      .then(res => {
        if (res) resolve(res)
        else reject(res)
      })
      .catch(err => reject(err))
    })
  },
  getAttendee: (attendeeId) => {
    return new Promise((resolve, reject) => {
      axios.get(process.env.REACT_APP_SERVER + 'publicapi/getAttendee/' + attendeeId)
      .then(res => {
        if (res) resolve(res)
        else reject(res)
      })
      .catch(err => reject(err))
    })
  },
  postAttendance: (attendanceDict) => {
    return new Promise((resolve, reject) => {
      axios.post(process.env.REACT_APP_SERVER + 'publicapi/attendance', attendanceDict)
      .then(res => {
        if (res) resolve(res)
        else reject(res)
      })
      .catch(err => reject(err))
    })
  },
}
