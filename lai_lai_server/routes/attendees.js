const express = require('express')
const router = express.Router()

const Attendees = require('../models/attendees')

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
  console.log(req.body);
  return Attendees
    .query()
    .insert(req.body)
    .then(table =>{
      res.sendStatus(200)
    })
    .catch(err => res.sendStatus(400))
});

router.delete('/deleteAttendee/:name', (req, res) => {
  const { name } = req.params
  return Attendees
    .query()
    .where({name})
    .delete()
    .then(table => {
      res.sendStatus(200)
    })
    .catch(err => res.sendStatus(400))
});

router.put('/attendance', (req, res) => {
  let { name, attendance } = req.body
  return Attendees
    .query()
    .where({name})
    .patch({ attending: attendance })
    .then(table => {
      console.log(table);
      res.sendStatus(200)
    })
    .catch(err => res.sendStatus(400))
});

module.exports = router
