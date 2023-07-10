'use strict'

const Joi = require('joi')
const createJsonError = require('../../errors/create-json-error')
const throwJsonError = require('../../errors/throw-json-error')
const {
    getUserByVerificationCode,
    udpatePassworByNameUser,
    findUserById,
    updatePasswordByIdUser,
} = require('../../repositories/users-repository')
const bcrypt = require('bcryptjs')
const { log } = require('winston')
const logger = require('../../logs/logger')

const schema = Joi.object().keys({
    password: Joi.string().min(4).max(20).required(),
    newPassword: Joi.string().min(4).max(20).required(),
})

async function udpatePassword(req, res) {
    try {
        const { idUser } = req.auth
        const { body } = req

        logger.info(`Usuario con id: ${idUser} cambiando su contraseña`)

        await schema.validateAsync(body)

        const { password, newPassword } = body

        const user = await findUserById(idUser)
        const oldPassword = user.password

        const isPasswordValid = await bcrypt.compare(password, oldPassword)

        if (!isPasswordValid) {
            throwJsonError(400, 'Contraseña incorrecta')
        }

        const passwordHash = await bcrypt.hash(newPassword, 12)

        await updatePasswordByIdUser(idUser, passwordHash)

        logger.info(
            `Usuario con id: ${idUser} ha cambiado su contraseña correctamente`
        )

        res.status(200)
        res.send({ message: 'Contraseña cambiada correctamente' })
    } catch (error) {
        logger.error(`Error al cambiar la contraseña del usuario`, error)
        createJsonError(error, res)
    }
}

module.exports = udpatePassword
