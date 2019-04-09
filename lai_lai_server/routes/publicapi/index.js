const express = require('express')
const router = express.Router()

const Events = require('../../models/events')
const Attendees = require('../../models/attendees')
const Attendance = require('../../models/attendance')

router.get('/getEvent/:event_id', (req, res) => {
  const { event_id } = req.params
  return Events
    .query()
    .where({id: event_id})
    .then(([event]) => {
      res.send(event.name)
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

router.post('/attendance', (req, res) => {
  const { attendee_id, event_id, status } = req.body
  // Check to see if the event exists
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
                .patchAndFetchById(attendance.id, {status})
                .then(sumbitAttendance => {
                  res.send(sumbitAttendance)
                })
              }
              else {
                return Attendance
                .query()
                .insert({attendee_id, event_id, status})
                .then(sumbitAttendance => {
                  res.send(sumbitAttendance)
                })
              }
            })
          }
          else {
            res.send('Attendee doesnt belong in this group.')
          }
        })
      }
      else {
        res.send('No event found')
      }
    })
    .catch(err => {
      console.log(err)
      res.sendStatus(400)
    })
});

module.exports = router
