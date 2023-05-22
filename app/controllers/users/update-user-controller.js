'use strict'

const Joi = require('joi')
const bcrypt = require('bcryptjs')
const randomstring = require('randomstring')
const {
    addVerificationCode,
    findUserByEmail,
    findUserById,
    udpateUserById,
} = require('../../repositories/users-repository')
const createJsonError = require('../../errors/create-json-error')
const throwJsonError = require('../../errors/throw-json-error')
const { sendMailRegister } = require('../../helpers/mail-smtp-SendGrid')

const schema = Joi.object().keys({
    nameUser: Joi.string().min(3).max(20).required(),
    email: Joi.string().email().required(),
    phone: Joi.any().required(),
})

async function updateUser(req, res) {
    try {
        const { idUser } = req.auth

        const { body } = req
        await schema.validateAsync(body)
        const { nameUser, email, phone } = req.body

        const userById = await findUserById(idUser)
        const user = await findUserByEmail(email)

        if (user && user.idUser !== idUser) {
            throwJsonError(409, 'Ya existe un usuario con ese email')
        }

        await udpateUserById({
            idUser,
            nameUser,
            email,
            phone,
        })

        if (email !== userById.email) {
            const verificationCode = randomstring.generate(64)
            await addVerificationCode(idUser, verificationCode)
            await sendMailRegister(nameUser, email, verificationCode)
        }

        res.send({ idUser, nameUser, email, phone, role: userById.role })
    } catch (err) {
        createJsonError(err, res)
    }
}

module.exports = updateUser
