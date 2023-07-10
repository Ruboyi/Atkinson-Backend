'use strict'

const { log } = require('winston')
const createJsonError = require('../../errors/create-json-error')
const {
    updateUserLogoutById,
    updateLastLoginById,
} = require('../../repositories/users-repository')
const logger = require('../../logs/logger')

async function logoutUser(req, res) {
    try {
        const { idUser } = req.auth

        await updateLastLoginById(idUser)

        await updateUserLogoutById(idUser)

        res.status(200)
        res.send()
    } catch (error) {
        const { idUser } = req.auth
        logger.error(`Error al cerrar sesión usuario con id:${idUser}`, error)
        createJsonError(error, res)
    }
}

module.exports = logoutUser
