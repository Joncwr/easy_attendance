const express = require('express')
const router = express.Router()

const Attendees = require('../../models/attendees')
const Attendance = require('../../models/attendance')
const Attendees_Groups = require('../../models/attendees_groups')

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
  let { name, number, group_id } = req.body
  return Attendees
    .query()
    .insert({name, number})
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
