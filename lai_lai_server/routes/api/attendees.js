const express = require('express')
const router = express.Router()

const Attendees = require('../../models/attendees')
const Attendance = require('../../models/attendance')
const Attendees_Groups = require('../../models/attendees_groups')
const Requested_Attendees = require('../../models/requested_attendees')

router.get('/test', (req, res) => {
  res.send('hi')
});

router.get('/getAttendees/:group_id', (req, res) => {
  let { group_id } = req.params
  return Attendees_Groups
    .query()
    .where({group_id})
    .eager('attendees')
    .then(table => {
      let attendeeArr = []
      table.forEach(data => {
        attendeeArr.push(data.attendees)
      })

      res.send(attendeeArr)
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(400)
    })
});

router.post('/addAttendee', (req, res) => {
  let { name, number, group_id, email, telegram, } = req.body
  return Attendees
    .query()
    .insert({name, number, email, telegram_id: telegram})
    .then(attendee => {
      return Attendees_Groups
      .query()
      .insert({attendee_id: attendee.id, group_id: group_id})
      .then(attendees_groups => {
        res.sendStatus(200)
      })
    })
    .catch(err => res.sendStatus(400))
});

router.put('/editAttendee', (req, res) => {
  let { id, name, number, group_id, email, telegram } = req.body
  return Attendees
    .query()
    .patchAndFetchById(id, {name, number, group_id, email, telegram_id: telegram})
    .then(attendee => {
      res.sendStatus(200)
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(400)}
    )
});

router.delete('/deleteAttendee/:id', (req, res) => {
  const { id } = req.params
  return Attendees_Groups
  .query()
  .where({attendee_id: id})
  .del()
  .then(attendees_groups => {
    return Attendance
    .query()
    .where({attendee_id: id})
    .del()
    .then(attendance => {
      return Attendees
      .query()
      .where({id})
      .delete()
      .then(table => {
        res.sendStatus(200)
      })
    })
  })
  .catch(err => res.sendStatus(400))
});

router.get('/getRequestedAttendees/:group_id', (req, res) => {
  const { group_id } = req.params
  return Requested_Attendees
  .query()
  .where({group_id})
  .then(requested_attendees => {
    res.send(requested_attendees)
  })
  .catch(err => res.sendStatus(400))
});

module.exports = router
