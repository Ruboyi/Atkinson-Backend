'use strict'

const express = require('express')
const validateAuth = require('../middlewares/validate-auth')
const updateShedyleById = require('../controllers/schedules/update-schedules-by-id')

const router = express.Router()

// Rutas públicas
router.route('/schedules').all(validateAuth).put(updateShedyleById)

module.exports = router
