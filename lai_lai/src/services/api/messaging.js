const jwtMiddleware = require('../jwtMiddleware')

module.exports = {
  sendBroadcastMessage: (attendees) => {
    return new Promise((resolve, reject) => {
      jwtMiddleware.jwtFetch('post', 'api/messaging/broadcast', attendees)
      .then(res => {
        if (res) resolve(res)
        else reject(res)
      })
      .catch(err => reject(err))
    })
  },
  sendMessage: (attendee) => {
    return new Promise((resolve, reject) => {
      jwtMiddleware.jwtFetch('post', 'api/messaging/single', attendee)
      .then(res => {
        if (res) resolve(res)
        else reject(res)
      })
      .catch(err => reject(err))
    })
  },
  sendTelegramBroadcast: (broadcastDict) => {
    return new Promise((resolve, reject) => {
      jwtMiddleware.jwtFetch('post', 'api/messaging/telegramBroadcast', broadcastDict)
      .then(res => {
        if (res) resolve(res)
        else reject(res)
      })
      .catch(err => reject(err))
    })
  },
  sendTelegramBroadcastUnanswered: (broadcastDict) => {
    return new Promise((resolve, reject) => {
      jwtMiddleware.jwtFetch('post', 'api/messaging/telegramBroadcastUnanswered', broadcastDict)
      .then(res => {
        if (res) resolve(res)
        else reject(res)
      })
      .catch(err => reject(err))
    })
  },
  sendSummaryNotesToDeclined: (summaryNotesDict) => {
    return new Promise((resolve, reject) => {
      jwtMiddleware.jwtFetch('post', 'api/messaging/sendSummaryNotesToDeclined', summaryNotesDict)
      .then(res => {
        if (res) resolve(res)
        else reject(res)
      })
      .catch(err => reject(err))
    })
  }
}
