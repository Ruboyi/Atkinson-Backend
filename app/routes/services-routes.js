const express = require('express')
const router = express.Router()
const validateAuth = require('../middlewares/validate-auth')
const getAllServicesController = require('../controllers/services/get-all-services-controller')
const createServiceController = require('../controllers/services/create-services-controller')

router
    .route('/services')
    .all(validateAuth)
    .get(getAllServicesController)
    .post(createServiceController)

module.exports = router
