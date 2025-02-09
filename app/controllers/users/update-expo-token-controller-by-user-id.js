'use strict'

const Joi = require('joi')
const createJsonError = require('../../errors/create-json-error')
const {
    updateExpoPushTokenByIdUser,
} = require('../../repositories/users-repository')
const logger = require('../../logs/logger')

const schema = Joi.object({
    idUser: Joi.number().positive().required(),
    expoPushToken: Joi.string().required(),
})

async function updateExpoPushToken(req, res) {
    try {
        const { body } = req

        await schema.validateAsync(body)
        const { idUser, expoPushToken } = body

        logger.info(
            `Actualizando token de Expo Push del usuario con id: ${idUser}`
        )

        await updateExpoPushTokenByIdUser(idUser, expoPushToken)

        logger.info(
            `Token de Expo Push del usuario con id: ${idUser} actualizado correctamente`
        )

        res.status(200).send({
            message: 'Token de Expo Push actualizado correctamente',
        })
    } catch (error) {
        logger.error(
            'Error al actualizar el token de Expo Push del usuario',
            error
        )
        createJsonError(error, res)
    }
}

module.exports = updateExpoPushToken
