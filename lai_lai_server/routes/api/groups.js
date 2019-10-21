const express = require('express')
const router = express.Router()

const Groups = require('../../models/groups')
const Events = require('../../models/events')
const Users_Groups = require('../../models/users_groups')
const Attendees_Groups = require('../../models/attendees_groups')
const Attendance = require('../../models/attendance')
const Testimonials = require('../../models/testimonials')

router.post('/createGroup', (req, res) => {
  const { group_name, user_id } = req.body
  return Groups
    .query()
    .insert({group_name})
    .then(group => {
      return Users_Groups
        .query()
        .insert({
          user_id,
          group_id: group.id
        })
        .then(users_groups => {
          res.send(group)
        })
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(400)
    })
});

router.post('/addUserToGroup', (req, res) => {
  const { group_id, user_id } = req.body
  return Users_Groups
    .query()
    .insert({
      user_id,
      group_id
    })
    .then(users_groups => {
      res.send(users_groups)
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(400)
    })
});

router.put('/editGroup', (req, res) => {
  const { group_name, group_id } = req.body
  return Groups
    .query()
    .patchAndFetchById(group_id, {group_name})
    .then(group => {
      res.send(group)
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(400)
    })
});

router.delete('/deleteGroup/:group_id', (req, res) => {
  const { group_id } = req.params
  return Events
  .query()
  .where({group_id})
  .then(events => {
    let eventsIdArr = []
    events.forEach(data => {
      eventsIdArr.push(data.id)
    })
    return Attendance
    .query()
    .whereIn('event_id', eventsIdArr)
    .del()
    .then(attendance => {
      return Groups
      .query()
      .patchAndFetchById(group_id, {current_event: null})
      .then(groups2 => {
        return Attendees_Groups
        .query()
        .where({group_id})
        .del()
        .then(Attendees_Groups => {
          return Users_Groups
          .query()
          .where({group_id})
          .del()
          .then(Users_Groups => {
            return Events
            .query()
            .where({group_id})
            .del()
            .then(Events => {
              return Groups
              .query()
              .where({id: group_id})
              .del()
              .then(group => {
                res.sendStatus(200)
              })
            })
          })
        })
      })
    })
  })
  .catch(err => {
    console.log(err)
    res.sendStatus(400)
  })
});

router.get('/getTestimonials/:groupId', (req, res) => {
  const { groupId } = req.params
  return Groups
    .query()
    .where({ id: groupId })
    .eager('attendees.testimonials(orderByDate)')
    .then(([group]) => {
      if (group.attendees) {
        let testimonialsArr = []
        group.attendees.forEach(attendee => {
          if (attendee.testimonials.length > 0)
          testimonialsArr.push(attendee)
        })
        res.send(testimonialsArr)
      }
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(400)
    })
});

router.get('/getOpenTestimonials/:groupId', (req, res) => {
  const { groupId } = req.params
  return Groups
    .query()
    .where({ id: groupId })
    .eager('attendees.testimonials(getNotSeen)')
    .then(([group]) => {
      if (group.attendees) {
        let testimonialsArr = []
        group.attendees.forEach(attendee => {
          if (attendee.testimonials.length > 0)
          testimonialsArr.push(attendee)
        })
        res.send(testimonialsArr)
      }
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(400)
    })
});

router.get('/getClosedTestimonials/:groupId', (req, res) => {
  const { groupId } = req.params
  return Groups
    .query()
    .where({ id: groupId })
    .eager('attendees.testimonials(getSeen)')
    .then(([group]) => {
      if (group.attendees) {
        let testimonialsArr = []
        group.attendees.forEach(attendee => {
          if (attendee.testimonials.length > 0)
          testimonialsArr.push(attendee)
        })
        res.send(testimonialsArr)
      }
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(400)
    })
});

router.put('/closeTestimonial/:testimonialId', (req, res) => {
  const { testimonialId } = req.params
  return Testimonials
    .query()
    .patchAndFetchById(testimonialId, {seen: true})
    .then(testimonials => {
      res.sendStatus(200)
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(400)
    })
});

router.put('/chooseSongPicker/:groupId', (req, res) => {
  const { groupId } = req.params
  let { id } = req.body
  return Groups
    .query()
    .patchAndFetchById(groupId, {song_picker: id})
    .then(Groups => {
      res.sendStatus(200)
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(400)
    })
});

module.exports = router
