const Attendees = require('../../models/attendees')
const Events = require('../../models/events')
const Groups = require('../../models/groups')
const { options, setOptionsMenuVariables } = require('../menus/attendance/options')
const { attendanceApi } = require('../../routes/publicapi')
const ObjectHelper = require('../helpers/ObjectHelper')
let dates = {}

function getTelegramId(id) {
  return new Promise((resolve, reject) => {
    let localItem = localStorage.getItem(id)
    if (localItem) {
      resolve(JSON.parse(localItem))
    }
    else {
      return Attendees
      .query()
      .eager('groups')
      .where({telegram_id: id})
      .then(([attendee]) => {
        let attendeeDict = {
          id: attendee.id,
          group_id: attendee.groups[0].id,
        }
        localStorage.setItem(id, JSON.stringify(attendeeDict))
        resolve(attendeeDict);
        return attendee
      })
      .catch(err => {
        reject(err)
        return err
      })
    }
  })
}

function getEvents(id) {
  return new Promise((resolve, reject) => {
    let localItem = JSON.parse(localStorage.getItem(id))
    let group_id = localItem.group_id
    return Events
    .query()
    .where({ group_id , closed: false})
    .then(events => {
      dates = {}
      events.forEach(data =>{
        dates[data.id] = '🗓 ' + data.name
      })
      resolve()
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

function authEventId(id, group_id) {
  return new Promise((resolve, reject) => {
    return Events
    .query()
    .where({id, group_id, closed: false})
    .then(res => resolve(res))
    .catch(err => reject(err))
  })
}

function endMenuConvo(ctx, method) {
  let id = ctx.from.id
  let localItem = JSON.parse(localStorage.getItem(id))
  localItem['eventOptions'] = {}
  localItem['testimonials'] = {}
  localItem['worshipSong'] = {}
  localItem['worshipSongDedication'] = {}
  localItem['summarynotes'] = {}
  localStorage.setItem(id, JSON.stringify(localItem))
  ctx.deleteMessage()
  if (method === 'happy') {
    ctx.replyWithSticker('CAADBQADAQADH-QBK5v1jkw34ZM6Ag')
  }
  else if (method === 'sad') {
    ctx.replyWithSticker('CAADBQADAgADH-QBK1Ho3U-R2nJ-Ag')
    ctx.reply('Thank you, I hope you will be able to make it the next time :(')
  }
}

module.exports = {
  auth: (ctx, next, options) => {
    getTelegramId(ctx.from.id)
    .then(res => {
      if (res) {
        if (ctx.startPayload) {
          // Load Start Paylaoad here!!!
          console.log(ctx.startPayload)
          let localItem = JSON.parse(localStorage.getItem(ctx.from.id))
          if (ctx.startPayload.search('attfor') !== -1) {
            let group_id = localItem.group_id
            let event_id = ctx.startPayload.replace('attfor', '')
            authEventId(event_id, group_id)
            .then(res => {
              if (res.length > 0) {
                options.datesReplyMiddleware.setSpecific(ctx, 'a:e-' + event_id)
              }
              else ctx.reply('Sorry the event was not found or has been closed')
            })
            .catch(err => {
              console.log(err)
              ctx.reply('Sorry the event was not found or has been closed')
            })
          }
          if (ctx.startPayload.search('sngdedfor') !== -1) {
            let group_id = localItem.group_id
            let event_id = ctx.startPayload.replace('sngdedfor', '')
            authEventId(event_id, group_id)
            .then(res => {
              if (res.length > 0) {
                localItem['worshipSongDedication'] = {
                  event_id,
                  song_name: '',
                  text: '',
                  url: '',
                }
                localStorage.setItem(ctx.from.id, JSON.stringify(localItem))
                options.sendworshipsongsReplyMiddleware.setSpecific(ctx, 'sw')
              }
              else ctx.reply('Sorry the event was not found or has been closed')
            })
            .catch(err => {
              console.log(err)
              ctx.reply('Sorry the event was not found or has been closed')
            })
          }
        }
        else {
          return next()
        }
      }
      else {
        ctx.reply('No such user registered. Please get the link to register for your group from your group leader. Thank you 😊')
      }
    })
    .catch(err => {
      console.log(ctx.from.id);
      console.log(err)
      ctx.reply('No such user registered. Please get the link to register for your group from your group leader. Thank you 😊')
    })
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
          endMenuConvo(ctx, 'happy')
        })
        .catch(err => {
          console.log(err);
          ctx.reply('Error has occured.')
        })
      }
    })
  },
  resetTestimonials: (ctx, next) => {
    let id = ctx.from.id
    let localItem = JSON.parse(localStorage.getItem(id))
    if (localItem.testimonials) {
      localItem.testimonials = {}
    }
    else localItem['testimonials'] = {}
    localStorage.setItem(id, JSON.stringify(localItem))
    return next()
  },
  getWorshipSong: (ctx, next) => {
    let id = ctx.from.id
    let localItem = JSON.parse(localStorage.getItem(id))
    localItem['worshipSong'] = {}
    localStorage.setItem(id, JSON.stringify(localItem))
    return Groups
    .query()
    .eager('events')
    .where({id: localItem.group_id})
    .then(([group]) => {
      if (!ObjectHelper.isEmpty(group.events.worship_song)) {
        let worshipSong = group.events.worship_song
        return Attendees
        .query()
        .where({id: worshipSong.attendee_id})
        .then(([attendee]) => {
          worshipSong['attendee_name'] = attendee.name
          worshipSong['event_name'] = group.events.name
          localItem['worshipSong'] = worshipSong
          localStorage.setItem(id, JSON.stringify(localItem))
          return next()
        })
      }
      else {
        ctx.reply('No worship songs were recorded for this event yet.')
      }
    })
    .catch(err => {
      console.log(err)
      ctx.reply('Error has occured.')
    })
  },
  endMenuConvo,
  registration: (ctx, next, options) => {
    let group_id = ctx.startPayload.replace('regfor', '')
    let id = ctx.from.id
    let beforeParseLS = localStorage.getItem('register')
    let localReg
    if (beforeParseLS) localReg = JSON.parse(beforeParseLS)
    if (!localReg) {
      localReg = {}
    }
    localReg[id] = { name: '', number: '', email: '' , group_id}
    localStorage.setItem('register', JSON.stringify(localReg))
    options.registrationReplyMiddleware.setSpecific(ctx, 'main')
  },
  getSummaryEvents: (ctx, next) => {
    let id = ctx.from.id
    let localItem = JSON.parse(localStorage.getItem(id))
    let { group_id } = localItem
    return Events
    .query()
    .where({ group_id })
    .whereNotNull('summary_notes')
    .then(events => {
      let summaryEvents = []
      if (events.length > 0) {
        events.forEach(data => {
          let { id, name, worship_song, summary_notes } = data
          summaryEvents.push({id, name, worship_song, summary_notes})
        })
        if (summaryEvents.length > 0) {
          localItem['summarynotes'] = summaryEvents
          localStorage.setItem(id, JSON.stringify(localItem))
          return next()
        }
        else ctx.reply('Sorry there was no summary notes found. 😭')
      }
      else ctx.reply('Sorry there was no summary notes found. 😭')
    })
    .catch(err => {
      console.log(err)
      ctx.reply('Error has occured.')
    })
    // return next()
  }
}
