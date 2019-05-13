const Attendees = require('../../models/attendees')
const Events = require('../../models/events')
const { options, setOptionsMenuVariables } = require('../attendance/options')
const { attendanceApi } = require('../../routes/publicapi')
let dates = {}
let attendance = {}

function getTelegramId(id) {
  return new Promise((resolve, reject) => {
    return Attendees
    .query()
    .eager('groups')
    .where({telegram_id: id})
    .then(([attendee]) => {
      let localItem = JSON.parse(localStorage.getItem(id))
      if (!localItem) {
        let attendeeDict = {
          id: attendee.id,
          group_id: attendee.groups[0].id,
        }
        localStorage.setItem(id, JSON.stringify(attendeeDict))
      }
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
        let attendeeDict = {
          id: attendee.id,
          group_id,
        }
        localStorage.setItem(id, JSON.stringify(attendeeDict))
        dates = {}
        events.forEach(data =>{
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

function setEventOptions(id, eventOptions) {
  return new Promise((resolve, reject) => {
    let localItem = JSON.parse(localStorage.getItem(id))
    let eventOptionsArr = []
    eventOptions.forEach(data => {
      let extraFields
      if (data.extraFields) {
        extraFields = []
        if (data.type === 'comments') {
          extraFields.push({name: data.extraFields, comment: ''})
        }
        else if (data.extraFields.length > 0) {
          data.extraFields.forEach(extraFieldsData => {
            extraFields.push({name: extraFieldsData, value: false})
          })
        }
      }
      let { type, fieldName, fieldType, tags } = data
      eventOptionsArr.push({
        type, fieldName, fieldType, tags, value: false, extraFields
      })
    })
    localItem['eventOptions'] = eventOptionsArr
    localStorage.setItem(id, JSON.stringify(localItem))
    resolve()
  })
}

module.exports = {
  auth: (ctx, next) => {
    getTelegramId(ctx.from.id)
    .then(res => {
      console.log(res);
      if (res) {
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
    return {dates}
  },

  getOptions: (ctx, next) => {
    console.log(ctx.match);
    let id = ctx.from.id
    let spliceFront = ctx.match[0].replace('a:e-', '')
    let event_id = spliceFront.replace(':y', '')
    let localItem = JSON.parse(localStorage.getItem(id))
    if (!localItem) getTelegramId(id)
    else {
      localItem['event_id'] = event_id
      localStorage.setItem(id, JSON.stringify(localItem))
    }
    return Events
    .query()
    .where({id: event_id})
    .then(([event]) => {
      let eventOptions = event.event_schema || []
      if (eventOptions.length > 0) {
        setEventOptions(id, eventOptions)
        .then(res => {
          return next()
        })
        .catch(err => {
          console.log(err)
          ctx.reply('An error has occurred.')
        })
      }
      else {
        attendanceApi(localItem.id, localItem.event_id, true)
        .then(res => {
          ctx.deleteMessage()
          ctx.reply('Thank You~')
        })
        .catch(err => {
          console.log(err);
          ctx.reply('Error has occured')
        })
      }
    })
    // menu.push(options.manual('adwadwad','a'))
    // menu.push(options.manual('adwadwasdad','aa'))
    // initMenu(menu)
    // return next()
  },

  clearOptions: (ctx) => {
    let id = ctx.from.id
    let localItem = JSON.parse(localStorage.getItem(id))
    console.log(localItem);
  }
}
