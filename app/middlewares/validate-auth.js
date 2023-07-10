'use strict'
const jwt = require('jsonwebtoken')
const createJsonError = require('../errors/create-json-error')
const throwJsonError = require('../errors/throw-json-error')
const logger = require('../logs/logger')
const { JWT_SECRET } = process.env

function extractAccessToken(headers) {
    const { authorization } = headers
    if (!authorization || !authorization.startsWith('Bearer ')) {
        logger.error('han intentado acceder sin autorización')
        throwJsonError(403, 'Autorización requerida')
    }

    return authorization.split(' ')[1]
    // return authorization.slice(7, authorization.length);
}

function validateAuth(req, res, next) {
    try {
        const { headers } = req
        const token = extractAccessToken(headers)
        const decodedToken = jwt.verify(token, JWT_SECRET)

        const { idUser, nameUser, role } = decodedToken
        req.auth = { idUser, nameUser, role }

        next()
    } catch (error) {
        const { idUser } = req.auth
        if (error.name === 'TokenExpiredError') {
            logger.error('Token expirado de usuario con id: ' + idUser)
            throwJsonError(403, 'Token expirado')
        } else {
            createJsonError(error, res)
        }
    }
}

module.exports = validateAuth
