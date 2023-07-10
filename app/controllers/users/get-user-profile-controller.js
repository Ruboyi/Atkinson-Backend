'use strict'

const { log } = require('winston')
const createJsonError = require('../../errors/create-json-error')
const throwJsonError = require('../../errors/throw-json-error')
const { findUserById } = require('../../repositories/users-repository')
const logger = require('../../logs/logger')

async function getUserProfile(req, res) {
    try {
        const { idUser } = req.auth
        const user = await findUserById(idUser)
        if (!user) {
            throwJsonError(400, 'El usuario no existe')
        }
        const { nameUser, email, image, phone, createdAt } = user

        logger.info(`Usuario con id: ${idUser} ha accedido a su perfil`)
        res.status(200)
        res.send({
            idUser,
            nameUser,
            email,
            image,
            phone,
            createdAt,
        })
    } catch (error) {
        const { idUser } = req.auth
        logger.error(
            `Error al acceder al perfil del usuario con id:${idUser}`,
            error
        )
        createJsonError(error, res)
    }
}

module.exports = getUserProfile
