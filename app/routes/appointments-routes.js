'use strict';

const express = require('express');
const validateAuth = require('../middlewares/validate-auth');
const createAppointmentController = require('../controllers/appointments/create-appointment-controller');
const getAllAppoimnetsByBarberId = require('../controllers/appointments/get-all-appoiments-by-barber-id');

const router = express.Router();

router.route('/appointments')
  .all(validateAuth) // Middleware de validación de autenticación
  .post(createAppointmentController);

router.route('/appointments/:idBarber').all(validateAuth).get(getAllAppoimnetsByBarberId);

module.exports = router;
