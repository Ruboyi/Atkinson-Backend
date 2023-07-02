'use strict'

const Joi = require('joi')
const createJsonError = require('../../errors/create-json-error')
const throwJsonError = require('../../errors/throw-json-error')
const {
    getUserByVerificationCode,
    updatePasswordByIdUser,
} = require('../../repositories/users-repository')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { sendMailRecoveryPassword } = require('../../helpers/mail-smtp-SendGrid')

const schema = Joi.object().keys({
    verificationCode: Joi.string().required(),
})

async function recoveryPasswordController(req, res) {
    try {
        const { body } = req
        await schema.validateAsync(body)
        const { verificationCode } = body

        const user = await getUserByVerificationCode(verificationCode)
        if (!user) {
            throwJsonError(400, 'El código de verificación no es válido')
        }

        const { nameUser, email, idUser } = user

        // Generar una contraseña temporal aleatoria
        const temporaryPassword = generateTemporaryPassword()

        const passwordHash = await bcrypt.hash(temporaryPassword, 12)

        // Actualizar la contraseña del usuario con la contraseña temporal
        const response = await updatePasswordByIdUser(idUser, passwordHash)

        // Enviar la contraseña temporal por correo electrónico
        await sendMailRecoveryPassword(nameUser, email, temporaryPassword)

        res.status(200)
        res.send({ message: 'Correo enviado correctamente' })
    } catch (error) {
        createJsonError(error, res)
    }
}

function generateTemporaryPassword(length = 6) {
    const characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let temporaryPassword = ''

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length)
        temporaryPassword += characters.charAt(randomIndex)
    }

    return temporaryPassword
}
module.exports = recoveryPasswordController
