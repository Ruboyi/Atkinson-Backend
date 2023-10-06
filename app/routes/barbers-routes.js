'use strict'

const express = require('express')
const validateAuth = require('../middlewares/validate-auth')
const getBarbers = require('../controllers/barbers/get-all-barbers-controller')
const getAllBarbersWithShedule = require('../controllers/barbers/get-all-barbers-with-schedule')

const router = express.Router()

// Rutas públicas
router.route('/barbers').all(validateAuth).get(getBarbers)
router.route('/all-barbers').all(validateAuth).get(getAllBarbersWithShedule)

// Rutas privadas
// router.route("/").all(validateAuth).post(createBarber);
// router.route("/:barberId").all(validateAuth).put(updateBarber).delete(deleteBarber);

module.exports = router
