const express = require('express')
const router = express.Router()
const AccountsApi = require('./accounts')

router.use('/', AccountsApi)

module.exports = router
