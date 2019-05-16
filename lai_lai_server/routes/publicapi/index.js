const express = require('express')
const router = express.Router()

const Events = require('../../models/events')
const Attendees = require('../../models/attendees')
const Attendance = require('../../models/attendance')
const Groups = require('../../models/groups')
const Testimonials = require('../../models/testimonials')
const Requested_Attendees = require('../../models/requested_attendees')

function attendanceApi(attendee_id, event_id, status, eventOptions) {
  return new Promise((resolve, reject) => {
    return Events
      .query()
      .where({id: event_id})
      .then(([event]) => {
        if (event) {
          // Check to see if attendees belong to the group of the event
          return Attendees
          .query()
          .where({id: attendee_id})
          .eager('groups')
          .then(([attendee]) => {
            let attendeeGroup = attendee.groups
            let groupMatches = false
            attendeeGroup.forEach(data => {
              if (data.id = event.group_id) groupMatches = true
            })
            if (groupMatches) {
              // Check to see if the attendee has confirmed their status yet, if havent insert, if not update
              return Attendance
              .query()
              .where({attendee_id, event_id})
              .then(([attendance]) => {
                if (attendance) {
                  return Attendance
                  .query()
                  .patchAndFetchById(attendance.id, {status, conditions: eventOptions})
                  .then(sumbitAttendance => {
                    resolve(sumbitAttendance)
                  })
                }
                else {
                  return Attendance
                  .query()
                  .insert({attendee_id, event_id, status, conditions: eventOptions})
                  .then(sumbitAttendance => {
                    resolve(sumbitAttendance)
                  })
                }
              })
            }
            else {
              resolve('Attendee doesnt belong in this group.')
            }
          })
        }
        else {
          resolve('No event found')
        }
      })
      .catch(err => {
        reject(err)
      })
  })
}

function addTestimonial(testimonial, attendee_id, group_id) {
  return new Promise((resolve, reject) => {
    return Testimonials
    .query()
    .insert({ testimonial, attendee_id, group_id })
    .then(testimonial => {
      resolve(testimonial)
    })
    .catch(err => {
      reject(err)
    })
  })
}

function addWorshipSong(event_id, worship_song) {
  return new Promise((resolve, reject) => {
    return Events
    .query()
    .patchAndFetchById(event_id, {worship_song})
    .then(res => {
      console.log('events => ', res);
      resolve(res)})
    .catch(err => reject(err))
  })
}

function requestAddAttendee(attendeeDict) {
  let { name, number, email, group_id, telegram_id } = attendeeDict
  return new Promise((resolve, reject) => {
    return Requested_Attendees
    .query()
    .insert({ name, number, email, group_id, telegram_id})
    .then(requested_attendees => resolve(requested_attendees))
    .catch(err => reject(err))
  })
}

router.get('/getEvent/:event_id', (req, res) => {
  const { event_id } = req.params
  return Events
    .query()
    .where({id: event_id})
    .then(([event]) => {
      res.send({
        name: event.name,
        closed: event.closed,
        schema: event.event_schema,
        message: event.message
      })
    })
    .catch(err => res.sendStatus(400))
});

router.post('/twilio/statusCallback', (req, res) => {
  let { MessageSid, MessageStatus, EventType } = req.body
  let message_status
  if (MessageStatus === 'delivered') {
    if (EventType === 'READ') message_status = 'read'
    else message_status = 'delivered'
  }
  else message_status = 'failed'
  return Attendance
  .query()
  .where({message_sid: MessageSid})
  .patch({ message_status })
  .then(attendance => {
    console.log(attendance)
    res.sendStatus(200)
  })
  .catch(err => {
    console.log(err)
    res.sendStatus(400)
  })
});

router.get('/getAttendee/:attendee_id', (req, res) => {
  const { attendee_id } = req.params
  return Attendees
    .query()
    .where({ id: attendee_id })
    .then(([user]) => {
      res.send(user.name)
    })
    .catch(err => {
      res.sendStatus(400)
    })
});

router.get('/getAttendees/:groupId', (req, res) => {
  const { groupId } = req.params
  return Groups
    .query()
    .where({ id: groupId })
    .eager('attendees')
    .then(([group]) => {
      if (group.attendees) {
        res.send(group.attendees)
      }
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(400)
    })
});

router.post('/attendance', (req, res) => {
  const { attendee_id, event_id, status, eventOptions } = req.body
  attendanceApi(attendee_id, event_id, status, eventOptions)
  .then(result => {
    res.send(result)
  })
  .catch(err => {
    console.log(error)
    res.sendStatus(400)
  })
  // Check to see if the event exists
});

router.post('/request_add_attendee/:group_id', (req, res) => {
  let { name, number, email } = req.body
  let { group_id } = req.params
  let attendeeDict = {name, number, email, group_id}
  requestAddAttendee(attendeeDict)
  .then(result => {
    console.log(result)
    res.sendStatus(200)
  })
  .catch(err => {
    console.log(err);
    res.sendStatus(400)
  })
});

router.post('/addTestimonial/:attendee_id', (req, res) => {
  let { testimonial, group_id } = req.body
  let { attendee_id } = req.params
  addTestimonial(testimonial, attendee_id, group_id)
  .then(result => {
    console.log(result)
    res.sendStatus(200)
  })
  .catch(err => {
    console.log(err);
    res.sendStatus(400)
  })
});

router.post('/addWorshipSong/:event_id', (req, res) => {
  let { worship_song } = req.body
  let { event_id } = req.params
  addWorshipSong(event_id, worship_song)
  .then(result => {
    console.log(result)
    res.sendStatus(200)
  })
  .catch(err => {
    console.log(err);
    res.sendStatus(400)
  })
});

module.exports = {
  Public: router,
  attendanceApi,
  addTestimonial,
  addWorshipSong,
  requestAddAttendee,
}
