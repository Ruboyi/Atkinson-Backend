const express = require('express')
const router = express.Router()
const validateAuth = require('../middlewares/validate-auth')
const getAllServicesController = require('../controllers/services/get-all-services-controller')
const createServiceController = require('../controllers/services/create-services-controller')
const deleteServiceController = require('../controllers/services/delete-services-controller')
const updateServiceController = require('../controllers/services/update-services-controller')
const getServicesByBarberController = require('../controllers/services/get-services-by-barber-controller')

router
    .route('/services/:idBarbershop')
    .all(validateAuth)
    .get(getAllServicesController)
    .post(createServiceController)

router
    .route('/services/:idService')
    .all(validateAuth)
    .delete(deleteServiceController)
    .put(updateServiceController)

router
    .route('/barbers/:idBarber/barbershops/:idBarbershop/services')
    .all(validateAuth)
    .get(getServicesByBarberController)

module.exports = router
