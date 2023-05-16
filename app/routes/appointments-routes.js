'use strict';

const express = require('express');
const validateAuth = require('../middlewares/validate-auth');
const createAppointmentController = require('../controllers/appointments/create-appointment-controller');

const router = express.Router();

router.route('/appointments')
  .all(validateAuth) // Middleware de validación de autenticación
  .post(createAppointmentController);

module.exports = router;
