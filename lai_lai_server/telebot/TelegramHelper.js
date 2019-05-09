const Attendees = require('../models/attendees')
const Events = require('../models/events')

let dates = {}
let eventOptions = {}

function getTelegramId(id) {
  return new Promise((resolve, reject) => {
    return Attendees
    .query()
    .where({telegram_id: id})
    .then(attendee => {
      resolve(attendee);
      return attendee
    })
    .catch(err => {
      reject(err)
      return err
    })
  })
}

function getEvents(id) {
  return new Promise((resolve, reject) => {
    return Attendees
    .query()
    .where({telegram_id: id})
    .eager('groups')
    .then(([attendee]) => {
      let group_id = attendee.groups[0].id
      return Events
      .query()
      .where({ group_id , closed: false})
      .then(events => {
        events.forEach(data =>{
          eventOptions[data.id] = data.event_schema
          dates[data.id] = data.name
        })
        resolve()
      })
    })
    .catch(err => {
      reject(err)
    })
  })
}

let test = function(id) {
  return new Promise((resolve, reject) => {
    return Attendees
    .query()
    .where({telegram_id: id})
    .eager('groups')
    .then(([attendee]) => {
      let group_id = attendee.groups[0].id
      return Events
      .query()
      .where({ group_id , closed: false})
      .then(events => {
        resolve(events);
        return events
      })
    })
    .catch(err => {
      reject(err)
      return err
    })
  })
}

module.exports = {
  auth: (id, next) => {
    getTelegramId(id)
    .then(res => {
      if (res[0]) {
        return next()
      }
      else {
        ctx.reply('No such user registered.')
      }
    })
    .catch(err => console.log(err))
  },

  getEventDates: (id, next) => {
    getEvents(id)
    .then(res => {
      return next()
    })
    .catch(err => console.log(err))
  },

  getTelegramId: (id) => {
    return new Promise((resolve, reject) => {
      return Attendees
      .query()
      .where({telegram_id: id})
      .then(attendee => {
        resolve(attendee);
        return attendee
      })
      .catch(err => {
        reject(err)
        return err
      })
    })
  },

  getDates: () => {
    return {dates, eventOptions}
  },



  test: test,
}
