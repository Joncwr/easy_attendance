const express = require('express')
const router = express.Router()

const accountSid = 'AC1f07119bcde145d72ae5fadc23503ec6';
const authToken = 'f6dfb3d44f606fa2462519d5b9a38030';
const client = require('twilio')(accountSid, authToken);

router.post('/broadcast', (req, res) => {
  let attendees = req.body
  let result = []
  let test
  let counter = 0
  attendees.forEach(data => {
    counter++
    let { name } = data
    let formattedName = name.replace(/ /g, '%20')
    client.messages
      .create({
         body: `http://ec2-18-191-78-79.us-east-2.compute.amazonaws.com/confirmation?name=${formattedName} Hi! Please click on the link to confirm your attendance for the upcoming bible study!`,
         from: 'whatsapp:+14155238886',
         to: `whatsapp:${data.number}`
       })
      .then(message => {
        result.push({
          name: data.name,
          message: message
        })
        test = message
        // console.log(message)
      })
      .catch(err => {
        // console.log(err)
        res.sendStatus(400)
      })
      .done();
    if (counter === attendees.length) res.send(result)
  })
});

router.post('/single', (req, res) => {
  let { name, number } = req.body
  let formattedName = name.replace(/ /g, '%20')
  client.messages
    .create({
       body: `http://ec2-18-191-78-79.us-east-2.compute.amazonaws.com/confirmation?name=${formattedName} Hi! Please click on the link to confirm your attendance for the upcoming bible study!`,
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
