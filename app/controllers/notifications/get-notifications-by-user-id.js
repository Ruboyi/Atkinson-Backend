'use strict'

const createJsonError = require('../../errors/create-json-error')
const throwJsonError = require('../../errors/throw-json-error')
const logger = require('../../logs/logger')
const {
    getNotificationsByUserId,
} = require('../../repositories/notifications-repository')

async function getUserNotifications(req, res) {
    try {
        const idUser = req.auth.idUser

        if (!idUser) throwJsonError(404, 'No se encontró el id del usuario')

        logger.info(
            `Usuario con id: ${idUser} ha solicitado lista de notificaciones`
        )

        const notifications = await getNotificationsByUserId(idUser)

        logger.info(
            `Usuario con id: ${idUser} ha recibido lista de notificaciones correctamente`
        )

        res.status(200)
        res.send({ data: notifications })
    } catch (error) {
        logger.error(`Error al obtener lista de de notificaciones`, error)
        createJsonError(error, res)
    }
}

module.exports = getUserNotifications
