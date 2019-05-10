require('dotenv').config()
const Api = require('./routes/api')
const Admin = require('./routes/admin')
const { Public } = require('./routes/publicapi')

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const app = express();
const passport    = require('passport');
require('./auth/passport');
require('./telebot');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())

// const pino = require('express-pino-logger')();
// app.use(pino);

app.get('/online', (req, res) => {
  res.send('online')
});

app.use('/api', passport.authenticate('jwt', {session: false}), Api)
app.use('/admin', Admin)
app.use('/publicapi', Public)

app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}!!!!`));
