const express = require('express')
const router = express.Router()

const Events = require('../../models/events')
const Groups = require('../../models/groups')

router.post('/createEvent', (req, res) => {
  const { group_id, event_name } = req.body
  return Events
    .query()
    .insert({ name: event_name , group_id})
    .then(event => {
      return Groups
        .query()
        .patchAndFetchById(group_id, {current_event: event.id})
        .then(group => {
          res.send({
            event,
            group
          })
        })
    })
    .catch(err => res.sendStatus(400))
});

router.put('/updateEvent', (req, res) => {
  const { current_event, event_name } = req.body
  return Events
    .query()
    .patchAndFetchById(current_event, {name: event_name})
    .then(event => {
      res.send(event)
    })
    .catch(err => res.sendStatus(400))
});

router.delete('/deleteCurrentEvent/:group_id', (req, res) => {
  const { group_id } = req.params
  return Groups
    .query()
    .patchAndFetchById(group_id, {current_event: null})
    .then(Groups => {
      res.send(Groups)
    })
    .catch(err => res.sendStatus(400))
});

module.exports = router
