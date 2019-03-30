const express = require('express')
const router = express.Router()

const Date = require('../../models/date')

router.get('/getDate', (req, res) => {
  return Date
    .query()
    .then(table => {
      res.send(table)
    })
});

router.post('/createDate', (req, res) => {
  return Date
    .query()
    .insert(req.body)
    .then(table =>{
      res.sendStatus(200)
    })
    .catch(err => res.sendStatus(400))
});

router.put('/updateDate', (req, res) => {
  let { date, newDate } = req.body
  return Date
    .query()
    .where({date})
    .patch({date: newDate})
    .then(table => {
      console.log(table);
      res.sendStatus(200)
    })
    .catch(err => res.sendStatus(400))
});

module.exports = router
