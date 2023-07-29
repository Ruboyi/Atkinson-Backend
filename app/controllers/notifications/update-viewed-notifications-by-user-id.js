'use strict'

const createJsonError = require('../../errors/create-json-error')
const throwJsonError = require('../../errors/throw-json-error')
const logger = require('../../logs/logger')

async function updateViewedNotificationsByUserId(req, res) {
    try {
        const idUser = req.auth.idUser

        if (!idUser) throwJsonError(404, 'No se encontró el id del usuario')

        logger.info(
            `Usuario con id: ${idUser} ha solicitado actualizar las notificaciones`
        )

        await updateNotificationsByUserId(idUser)

        logger.info(
            `   Usuario con id: ${idUser} ha actualizado las notificaciones correctamente`
        )

        res.status(200)
        res.send({ message: 'Notificaciones actualizadas correctamente' })
    } catch (error) {
        logger.error(`Error al actualizar las notificaciones`)
        createJsonError(error, res)
    }
}

module.exports = updateViewedNotificationsByUserId
