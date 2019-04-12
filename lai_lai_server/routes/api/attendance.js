const express = require('express')
const router = express.Router()

const Attendance = require('../../models/attendance')

router.get('/getAttendance/:event_id', (req, res) => {
  let { event_id } =  req.params
  return Attendance
  .query()
  .where({event_id})
  .then((attendance) => {
    res.send(attendance)
  })
  .catch(err => {
    console.log(err)
    res.sendStatus(400)
  })
});

router.put('/updateAttendance', (req, res) => {
  let { attendee_id, event_id, status, tags } =  req.body

  return Attendance
  .query()
  .where({attendee_id, event_id})
  .patch({ status, tags })
  .then((attendance) => {
    res.sendStatus(200)
  })
  .catch(err => {
    console.log(err)
    res.sendStatus(400)
  })
});

module.exports = router
