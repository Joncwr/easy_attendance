const express = require('express')
const router = express.Router()

const accountSid = 'AC1f07119bcde145d72ae5fadc23503ec6';
const authToken = 'f6dfb3d44f606fa2462519d5b9a38030';
const client = require('twilio')(accountSid, authToken);

router.post('/broadcast', (req, res) => {
  let attendees = req.body
  attendees.forEach(data => {
    client.messages
      .create({
         body: `Hi! Please click on the link to confirm your attendance for the upcoming bible study! => http://ec2-18-191-78-79.us-east-2.compute.amazonaws.com/confirmation?name=${data.name}`,
         from: 'whatsapp:+14155238886',
         to: `whatsapp:${data.number}`
       })
      .then(message => {
        console.log(message)
        res.sendStatus(200)
      })
      .catch(err => res.sendStatus(400))
      .done();
  })
});

module.exports = router
