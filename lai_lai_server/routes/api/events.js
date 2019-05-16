const express = require('express')
const router = express.Router()

const Events = require('../../models/events')
const Groups = require('../../models/groups')

router.get('/getEvents/:group_id', (req, res) => {
  const { group_id } = req.params
  return Events
    .query()
    .where({ group_id })
    .then(events => {
      res.send(events)
    })
    .catch(err => res.sendStatus(400))
});

router.put('/setCurrentEvent', (req, res) => {
  const { group_id, event_id } = req.body
  return Groups
    .query()
    .patchAndFetchById(group_id, {current_event: event_id})
    .then(group => {
      res.send(group)
    })
    .catch(err => res.sendStatus(400))
});

router.put('/setEventStatus', (req, res) => {
  const { event_id, isEventClosed } = req.body
  return Events
    .query()
    .patchAndFetchById(event_id, {closed: isEventClosed})
    .then(event => {
      res.send(event)
    })
    .catch(err => res.sendStatus(400))
});

router.put('/setEventSchema', (req, res) => {
  const { event_id, eventSchema } = req.body
  return Events
    .query()
    .patchAndFetchById(event_id, {event_schema: eventSchema})
    .then(event => {
      res.send(event)
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(400)
    })
});

router.post('/createEvent', (req, res) => {
  const { group_id, event_name, summary_notes } = req.body
  return Events
    .query()
    .insert({ name: event_name , group_id, summary_notes})
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
  const { current_event, event_name, summary_notes } = req.body
  return Events
    .query()
    .patchAndFetchById(current_event, {name: event_name, summary_notes})
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

router.put('/addEventMessage', (req, res) => {
  const { eventId, message } = req.body
  return Events
    .query()
    .patchAndFetchById(eventId, { message })
    .then(event => {
      res.send(event)
    })
    .catch(err => res.sendStatus(400))
});

module.exports = router
