'use strict'

const express = require('express')
const validateAuth = require('../middlewares/validate-auth')
const createAppointmentController = require('../controllers/appointments/create-appointment-controller')
const getAllAppoimnetsByBarberId = require('../controllers/appointments/get-all-appoiments-by-barber-id')
const getAppoimentsByUser = require('../controllers/appointments/get-appointment-by-user-id')
const cancelAppointmentById = require('../controllers/appointments/cancel-appointment-controllers')
const getAllAppoimnets = require('../controllers/appointments/get-all-appoiments-controller')
const updateAppointementAdmin = require('../controllers/appointments/update-appointment-admin-controller')

const router = express.Router()

router
    .route('/appointments')
    .all(validateAuth) // Middleware de validación de autenticación
    .post(createAppointmentController)
    .put(updateAppointementAdmin)

router.route('/appointments').all(validateAuth).get(getAllAppoimnets)

router.route('/appointments/user').all(validateAuth).get(getAppoimentsByUser)
router
    .route('/appointments/:idBarber')
    .all(validateAuth)
    .get(getAllAppoimnetsByBarberId)
router
    .route('/appointments/:idAppointment')
    .all(validateAuth)
    .delete(cancelAppointmentById)

module.exports = router
