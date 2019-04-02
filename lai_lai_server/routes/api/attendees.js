const express = require('express')
const router = express.Router()

const Attendees = require('../../models/attendees')
const Attendance = require('../../models/attendance')
const Attendees_Groups = require('../../models/attendees_groups')

router.get('/test', (req, res) => {
  res.send('hi')
});

router.get('/getAttendees', (req, res) => {
  return Attendees
    .query()
    .then(table => {
      res.send(table)
    })
});

router.post('/addAttendee', (req, res) => {
  let { name, number, group_id } = req.body
  return Attendees
    .query()
    .insert({name, number})
    .then(attendee => {
      return Attendees_Groups
      .query()
      .insert({attendee_id: attendee.id, group_id: group_id})
      .then(attendees_groups => {
        res.send(200)
      })
      .catch(err => res.sendStatus(400))
    })
    .catch(err => res.sendStatus(400))
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

module.exports = router
