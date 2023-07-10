'use strict'

const Joi = require('joi')
const createJsonError = require('../../errors/create-json-error')
const throwJsonError = require('../../errors/throw-json-error')
const { removeUserById } = require('../../repositories/users-repository')
const logger = require('../../logs/logger')

const schema = Joi.number().positive().integer().required()

async function deleteUserById(req, res) {
    try {
        const { userId } = req.params
        await schema.validateAsync(userId)
        const { idUser, role } = req.auth

        if (role === 'admin') {
            await removeUserById(userId)
            logger.info(
                `Admin con id: ${idUser} ha eliminado al usuario con id: ${userId}`
            )
            res.status(200).send({ message: 'Usuario eliminado' })
        } else {
            if (idUser !== Number(userId)) {
                throwJsonError(400, 'Acceso denegado')
            }
            logger.info(`Usuario con id: ${idUser} ha eliminado su cuenta`)
            await removeUserById(idUser)
            res.status(200).send({ message: 'Usuario eliminado' })
        }
    } catch (error) {
        const { userId } = req.params
        logger.error(`Error al eliminar el usuario con id:${userId}`, error)
        createJsonError(error, res)
    }
}

module.exports = deleteUserById
