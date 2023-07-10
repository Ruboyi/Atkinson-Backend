'use strict'

const Joi = require('joi')
const createJsonError = require('../../errors/create-json-error')
const throwJsonError = require('../../errors/throw-json-error')
const { findUserById } = require('../../repositories/users-repository')
const { log } = require('winston')
const logger = require('../../logs/logger')
const schema = Joi.number().integer().positive().required()

async function getUserById(req, res) {
    try {
        const { idUser } = req.params
        await schema.validateAsync(idUser)
        const user = await findUserById(idUser)
        logger.info(`Usuario con id: ${idUser} accediendo a su perfil: ${user}`)
        if (!user) {
            throwJsonError(400, 'El usuario no existe')
        }
        const {
            nameUser,
            bio,
            email,
            phone,
            image,
            createdAt,
            verifiedAt,
            isOnline,
            lastLogin,
        } = user
        logger.info(`Usuario con id: ${idUser} ha accedido a su perfil`)
        res.status(200)
        res.send({
            nameUser,
            bio,
            email,
            phone,
            image,
            createdAt,
            verifiedAt,
            isOnline,
            lastLogin,
        })
    } catch (error) {
        const { idUser } = req.params
        logger.error(
            `Error al acceder al perfil del usuario con id:${idUser}`,
            error
        )
        createJsonError(error, res)
    }
}

module.exports = getUserById
