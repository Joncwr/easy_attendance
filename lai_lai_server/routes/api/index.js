const express = require('express')
const router = express.Router()

const Attendees = require('./attendees')
const Date = require('./date')
const Messaging = require('./messaging')
const Events = require('./events')
const Groups = require('./groups')
const Users = require('./users')

router.use('/attendees', Attendees)
router.use('/messaging', Messaging)
router.use('/date', Date)
router.use('/events', Events)
router.use('/groups', Groups)
router.use('/users', Users)

module.exports = router
