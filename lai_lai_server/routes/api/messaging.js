const express = require('express')
const router = express.Router()

const Attendance = require('../../models/attendance')
const accountSid = 'AC5af195c67fd6e784c03f34e51eb7dd3b';
const authToken = '33c1b87b673af4cb521989e6b27e42e2';
const client = require('twilio')(accountSid, authToken);

router.post('/broadcast', (req, res) => {
  let { attendeesData, event_id, message } = req.body
  console.log(attendeesData, event_id);
  let attendees = req.body
  let result = []
  let test
  let counter = 0
  attendeesData.forEach(data => {
    let { name, id, number } = data
    return Attendance
    .query()
    .where({attendee_id: id, event_id})
    .then(([row]) => {
      let link = `http://ec2-18-191-78-79.us-east-2.compute.amazonaws.com/confirmation?attendee_id=${id}&event_id=${event_id}, please click on the link to confirm your attendance!`
      if (!row) {
        return Attendance
        .query()
        .insert({attendee_id: id, event_id, status: null})
        .then(attendance => {
          client.messages
            .create({
               body: `Your ${message} code is ${link}`,
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
             body: `Your ${message} code is ${link}`,
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
      console.log('error => ', err);
      result.push({
        name: data.name,
        message: err
      })
    })
  })
});

router.post('/single', (req, res) => {
  let { name, id, number, event_id, message } = req.body
  return Attendance
    .query()
    .where({attendee_id: id, event_id})
    .then(([row]) => {
      let link = `http://ec2-18-191-78-79.us-east-2.compute.amazonaws.com/confirmation?attendee_id=${id}&event_id=${event_id}, please click on the link to confirm your attendance!`
      if (!row) {
        return Attendance
        .query()
        .insert({attendee_id: id, event_id, status: null})
        .then(attendance => {
          client.messages
            .create({
               body: `Your ${message} code is ${link}`,
               from: 'whatsapp:+14155238886',
               to: `whatsapp:${number}`
             })
            .then(message => {
              res.send(message)
            })
            .done();
        })
      }
      else {
        client.messages
          .create({
             body: `Your ${message} code is ${link}`,
             from: 'whatsapp:+14155238886',
             to: `whatsapp:${number}`
           })
          .then(message => {
            res.send(message)
          })
          .done();
      }
    })
    .catch(err => {
      console.log('error => ', err);
      res.send(err)
    })
});

module.exports = router
