require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const pino = require('express-pino-logger')();
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(pino);
app.use(cors())

const accountSid = 'AC1f07119bcde145d72ae5fadc23503ec6';
const authToken = 'f6dfb3d44f606fa2462519d5b9a38030';
const client = require('twilio')(accountSid, authToken);

app.post('/whatsapp', (req, res) => {
  let attendees = req.body.attendees
  attendees.forEach(data => {
    client.messages
      .create({
         body: `Hi! Please click on the link to confirm your attendance for the upcoming bible study! 18.191.78.79/confirmation?name=${data.name}`,
         from: 'whatsapp:+14155238886',
         to: `whatsapp:${data.number}`
       })
      .then(message => console.log(message))
      .done();
  })
});

app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}!!!!`));
