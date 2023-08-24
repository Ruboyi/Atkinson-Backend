'use strict'

const logger = require('../logs/logger')

function throwJsonError(status, message) {
    const error = new Error(message)
    error.status = status
    logger.error(message)
    throw error
}

module.exports = throwJsonError
