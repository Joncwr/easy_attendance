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

module.exports = router
