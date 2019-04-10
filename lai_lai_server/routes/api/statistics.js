const express = require('express')
const router = express.Router()

const Events = require('../../models/events')
const Attendance = require('../../models/attendance')

router.get('/history', (req, res) => {
  const { group_name, user_id } = req.body
  return Events
    .query()
    .eager('attendance.attendees')
    .then(events => {
      res.send(events)
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(400)
    })
});

module.exports = router
