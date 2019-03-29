require('dotenv').config()

const Attendees = require('./routes/attendees')
const Messaging = require('./routes/messaging')
const Date = require('./routes/date')

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())

// const pino = require('express-pino-logger')();
// app.use(pino);

app.get('/online', (req, res) => {
  res.send('online')
});

app.use('/attendees', Attendees)
app.use('/messaging', Messaging)
app.use('/date', Date)

app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}!!!!`));
