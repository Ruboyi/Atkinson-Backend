const express = require('express');
const router = express.Router();
const validateAuth = require('../middlewares/validate-auth');
const getAllServicesController = require('../controllers/services/get-all-services-controller');

router.route('/services')
  .all(validateAuth)
  .get(getAllServicesController);

module.exports = router;
