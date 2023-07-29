'use strict'

const express = require('express')
const validateAuth = require('../middlewares/validate-auth')
const getUserNotifications = require('../controllers/notifications/get-notifications-by-user-id')
const updateViewedNotificationsByUserId = require('../controllers/notifications/update-viewed-notifications-by-user-id')

const router = express.Router()

// Rutas públicas
router
    .route('/notifications')
    .all(validateAuth)
    .get(getUserNotifications)
    .put(updateViewedNotificationsByUserId)

module.exports = router
