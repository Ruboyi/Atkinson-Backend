const express = require('express')
const router = express.Router()
const validateAuth = require('../middlewares/validate-auth')
const getAllServicesController = require('../controllers/services/get-all-services-controller')
const createServiceController = require('../controllers/services/create-services-controller')
const deleteServiceController = require('../controllers/services/delete-services-controller')
const updateServiceController = require('../controllers/services/update-services-controller')

router
    .route('/services')
    .all(validateAuth)
    .get(getAllServicesController)
    .post(createServiceController)

router
    .route('/services/:idService')
    .all(validateAuth)
    .delete(deleteServiceController)
    .put(updateServiceController)

module.exports = router
