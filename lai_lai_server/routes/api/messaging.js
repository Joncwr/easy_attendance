const express = require('express')
const router = express.Router()

const Attendance = require('../../models/attendance')
const accountSid = 'AC1f07119bcde145d72ae5fadc23503ec6';
const authToken = 'f6dfb3d44f606fa2462519d5b9a38030';
const client = require('twilio')(accountSid, authToken);

router.post('/broadcast', (req, res) => {
  let { attendeesData, event_id } = req.body
  let attendees = req.body
  let result = []
  let test
  let counter = 0
  attendeesData.forEach(data => {
    let { name, id, number } = data
    return Attendance
    .query()
    .where({attendee_id: id})
    .then(([row]) => {
      if (!row) {
        return Attendance
        .query()
        .insert({attendee_id: id, event_id, status: null})
        .then(attendance => {
          client.messages
            .create({
               body: `http://ec2-18-191-78-79.us-east-2.compute.amazonaws.com/confirmation?attendee_id=${id}&event_id=${event_id} Hi ${name}! Please click on the link to confirm your attendance for the upcoming bible study!`,
               from: 'whatsapp:+14155238886',
               to: `whatsapp:${number}`
             })
            .then(message => {
              result.push({
                name: data.name,
                message: message
              })
              counter++
              if (counter === attendeesData.length) {
                res.send(result)
              }
            })
            .done();
        })
      }
      else {
        client.messages
          .create({
             body: `http://ec2-18-191-78-79.us-east-2.compute.amazonaws.com/confirmation?attendee_id=${id}&event_id=${event_id} Hi ${name}! Please click on the link to confirm your attendance for the upcoming bible study!`,
             from: 'whatsapp:+14155238886',
             to: `whatsapp:${number}`
           })
          .then(message => {
            result.push({
              name: data.name,
              message: message
            })
            counter++
            if (counter === attendeesData.length) {
              res.send(result)
            }
          })
          .done();
      }
    })
    .catch(err => {
      console.log('error!');
      result.push({
        name: data.name,
        message: err
      })
    })
  })
});

router.post('/single', (req, res) => {
  let { name, id, number, event_id } = req.body
  client.messages
    .create({
       body: `http://ec2-18-191-78-79.us-east-2.compute.amazonaws.com/confirmation?attendee_id=${id}&event_id=${event_id} Hi ${name}! Please click on the link to confirm your attendance for the upcoming bible study!`,
       from: 'whatsapp:+14155238886',
       to: `whatsapp:${number}`
     })
    .then(message => {
      res.sendStatus(200)
    })
    .catch(err => {
      res.sendStatus(400)
    })
    .done();
});

module.exports = router
