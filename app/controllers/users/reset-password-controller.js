'use strict'

const Joi = require('joi')
const createJsonError = require('../../errors/create-json-error')
const {
    findUserByEmail,
    updateUserVerificationCode,
} = require('../../repositories/users-repository')
const { sendMailRecoveryPassword } = require('../../helpers/mail-smtp-SendGrid')

const schema = Joi.object().keys({
    email: Joi.string().email().required(),
})

async function requestPasswordReset(req, res) {
    try {
        const { email } = req.body

        await schema.validateAsync({ email })

        const user = await findUserByEmail(email)
        if (!user) {
            throwJsonError(400, 'No existe usuario con este correo')
        }
        const { nameUser, idUser } = user

        const verificationCode = generateVerificationCode()
        await updateUserVerificationCode(idUser, verificationCode)

        await sendMailRecoveryPassword(nameUser, email, verificationCode)

        res.status(200).send({
            message:
                'Se ha enviado un correo de verificación. Por favor, revisa tu bandeja de entrada.',
        })
    } catch (error) {
        createJsonError(error, res)
    }
}

function generateVerificationCode() {
    const characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const codeLength = 4
    let verificationCode = ''
    for (let i = 0; i < codeLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length)
        verificationCode += characters.charAt(randomIndex)
    }
    return verificationCode
}

module.exports = requestPasswordReset
