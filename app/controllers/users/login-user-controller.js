'use strict'

const Joi = require('joi')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const createJsonError = require('../../errors/create-json-error')
const throwJsonError = require('../../errors/throw-json-error')
const {
    findUserByEmail,
    updateUserLoginById,
} = require('../../repositories/users-repository')
const { log } = require('winston')
const logger = require('../../logs/logger')
const schema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(4).max(20).required(),
})

async function loginUser(req, res) {
    try {
        const { body } = req
        await schema.validateAsync(body)

        const { email, password } = body
        const user = await findUserByEmail(email)
        if (!user) {
            throwJsonError(
                403,
                'No existe un usuario con ese email y/o password'
            )
        }
        const {
            idUser,
            nameUser,
            role,
            password: passwordHash,
            verifiedAt,
            isBanned,
            pushToken,
        } = user

        const isValidPassword = await bcrypt.compare(password, passwordHash)

        if (!isValidPassword) {
            logger.error(
                `Usuario con email ${email} e id: ${idUser} ha intentado iniciar sesión con una contraseña incorrecta`
            )
            throwJsonError(
                403,
                'No existe un usuario con ese email y/o password'
            )
        }
        if (!verifiedAt) {
            logger.error(
                `Usuario con email ${email} e id: ${idUser} ha intentado iniciar sesión sin verificar su cuenta`
            )
            throwJsonError(
                401,
                'Verifique su cuenta poder acceder a nuestros servicios'
            )
        }

        if (isBanned) {
            logger.error(
                `Usuario con email ${email} e id: ${idUser} ha intentado iniciar sesión con una cuenta baneada`
            )
            throwJsonError(
                403,
                'Su cuenta ha sido banneada temporalmente para más imformacion mandenos un correo a arcademarket@gmail.com'
            )
        }

        const { JWT_SECRET } = process.env
        const tokenPayload = { idUser, nameUser, role }
        const token = jwt.sign(tokenPayload, JWT_SECRET, {
            expiresIn: '15 days',
        })
        const response = {
            accessToken: token,
            expoPushToken: pushToken,
            expiresIn: '15 days',
            role: role,
            idUser: idUser,
        }

        logger.info(
            `Usuario con email ${email} e id: ${idUser} ha iniciado sesión exitosamente`
        )

        await updateUserLoginById(idUser)

        res.status(200)
        res.send(response)
    } catch (error) {
        const { email } = req.body
        logger.error(
            `Error al iniciar sesión con emal: ${email}: ${error.message}`
        )
        createJsonError(error, res)
    }
}

module.exports = loginUser
