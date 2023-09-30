'use strict'

const Joi = require('joi')
const createJsonError = require('../../errors/create-json-error')
const throwJsonError = require('../../errors/throw-json-error')
const { findUserByEmail } = require('../../repositories/users-repository')
const {
    sendMailRecoveryPasswordWeb,
} = require('../../helpers/mail-smtp-SendGrid')
const logger = require('../../logs/logger')

const schema = Joi.object().keys({
    email: Joi.string().email().required(),
})

async function forgotPassword(req, res) {
    try {
        const { body } = req

        await schema.validateAsync(body)
        const { email } = body

        const user = await findUserByEmail(email)
        if (!user) {
            throwJsonError(400, 'No existe usuario con este correo')
            logger.error(`No existe usuario con este correo`, email)
        }

        const { nameUser, verificationCode } = user

        await sendMailRecoveryPasswordWeb(nameUser, email, verificationCode)
        logger.info(`Correo enviado correctamente a ${email}`)
        res.status(200)
        res.send({ message: 'Correo enviado correctamente' })
    } catch (error) {
        createJsonError(error, res)
    }
}

module.exports = forgotPassword
