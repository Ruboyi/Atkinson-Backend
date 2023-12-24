'use strict'

const express = require('express')
const validateAuth = require('../middlewares/validate-auth')
const getBarbershops = require('../controllers/barbershops/get-barbershops-controller')

const router = express.Router()

// Rutas públicas
router.route('/barbershops').all(validateAuth).get(getBarbershops)

// Rutas privadas

module.exports = router
