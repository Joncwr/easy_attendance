const axios = require('../axios')

module.exports = {
  sendBroadcastMessage: (attendees) => {
    return new Promise((resolve, reject) => {
      axios.axiosApi('post', 'messaging/broadcast', attendees)
      .then(res => {
        if (res) resolve(res)
        else reject(res)
      })
      .catch(err => reject(err))
    })
  },
}
