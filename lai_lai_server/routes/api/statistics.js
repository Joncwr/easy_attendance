const express = require('express')
const router = express.Router()

const Events = require('../../models/events')
const Groups = require('../../models/groups')
const Attendance = require('../../models/attendance')
const Attendees_Groups = require('../../models/attendees_groups')

router.get('/past5Events/:group_id', (req, res) => {
  const { group_id } = req.params
  return Events
  .query()
  .where({group_id})
  .eager('attendance')
  .orderBy('id','asce')
  .then(events => {
    let last5Events
    if (events.length <= 5) last5Events = events
    else last5Events = events.slice(Math.max(events.length - 5, 1))
    let attendanceDict = {}
    last5Events.forEach((data,index) => {
      attendanceDict[last5Events[index].id] = {}
      attendanceDict[last5Events[index].id]['name'] = data.name
      attendanceDict[last5Events[index].id]['true'] = 0
      attendanceDict[last5Events[index].id]['false'] = 0
      last5Events[index].attendance.forEach(data => {
        if (data.status) attendanceDict[last5Events[index].id]['true']++
        else attendanceDict[last5Events[index].id]['false']++
      })
    })
    res.send(attendanceDict)
  })
  .catch(err => {
    console.log(err);
    res.sendStatus(400)
  })
});

router.get('/getAllAttendance/:group_id', (req, res) => {
  const { group_id } = req.params
  return Attendees_Groups
  .query()
  .where({group_id})
  .eager('attendees.attendance')
  .orderBy('id','asce')
  .then(attendees => {
    let attendanceDict = {}
    attendees.forEach((data,index) => {
      attendanceDict[data.attendee_id] = {}
      attendanceDict[data.attendee_id]['name'] = data.attendees.name
      let attended = 0
      let neverAttend = 0
      data.attendees.attendance.forEach(data2 => {
        if (data2.status) attended ++
        else neverAttend ++
      })
      attendanceDict[data.attendee_id]['attended'] = attended
      attendanceDict[data.attendee_id]['neverAttend'] = neverAttend
    })
    res.send(attendanceDict)
  })
  .catch(err => {
    console.log(err);
    res.sendStatus(400)
  })
});

module.exports = router
