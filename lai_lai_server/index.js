require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(pino);

const accountSid = 'AC1f07119bcde145d72ae5fadc23503ec6';
const authToken = 'f6dfb3d44f606fa2462519d5b9a38030';
const client = require('twilio')(accountSid, authToken);

app.post('/api/messages', (req, res) => {
 client.messages
       .create({
          body: 'Hi this is jon!',
          from: 'whatsapp:+14155238886',
          to: 'whatsapp:+6585718541'
        })
       .then(message => console.log(message))
       .done();
});

app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}!!!!`));
