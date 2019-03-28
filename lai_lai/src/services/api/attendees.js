const axios = require('../axios')

module.exports = {
  getAttendees: () => {
    return new Promise((resolve, reject) => {
      axios.axiosApi('get', 'attendees/getAttendees')
      .then(res => {
        if (res) resolve(res)
        else reject(res)
      })
      .catch(err => reject(err))
    })
  },
  addAttendee: (user) => {
    return new Promise((resolve, reject) => {
      axios.axiosApi('post', 'attendees/addAttendee', user)
      .then(res => {
        if (res) resolve(res)
        else reject(res)
      })
      .catch(err => reject(err))
    })
  },
  deleteAttendee: (name) => {
    return new Promise((resolve, reject) => {
      axios.axiosApi('delete', 'attendees/deleteAttendee/' + name)
      .then(res => {
        if (res) resolve(res)
        else reject(res)
      })
      .catch(err => reject(err))
    })
  },
  attendance: (attendance) => {
    return new Promise((resolve, reject) => {
      axios.axiosApi('put', 'attendees/attendance', attendance)
      .then(res => {
        if (res) resolve(res)
        else reject(res)
      })
      .catch(err => reject(err))
    })
  }
}
