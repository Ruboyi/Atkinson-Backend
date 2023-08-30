'use strict'

const express = require('express')
const validateAuth = require('../middlewares/validate-auth')
const getHolidays = require('../controllers/holidays/get-holidays-by-year-controller')

const router = express.Router()

router.route('/holidays/:year').all(validateAuth).get(getHolidays)

module.exports = router
