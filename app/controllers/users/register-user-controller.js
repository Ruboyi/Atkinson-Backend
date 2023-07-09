'use strict'

const Joi = require('joi')
const bcrypt = require('bcryptjs')
const randomstring = require('randomstring')
const createJsonError = require('../../errors/create-json-error')
const throwJsonError = require('../../errors/throw-json-error')
const {
    createUser,
    findUserByEmail,
} = require('../../repositories/users-repository')
const { sendMailRegister } = require('../../helpers/mail-smtp-SendGrid')

const schema = Joi.object().keys({
    nameUser: Joi.string().min(3).max(120).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().min(9).max(12).required(),
    password: Joi.string().min(4).max(20).required(),
    verifyPassword: Joi.ref('password'),
    image: Joi.any()
        .meta({ swaggerType: 'file' })
        .optional()
        .description('Image file'),
})

const { HTTP_SERVER, PATH_USER_IMAGE } = process.env

async function registerUser(req, res) {
    try {
        const { body } = req
        console.log(body)
        await schema.validateAsync(body)
        const { nameUser, email, password, phone, image } = body

        const user = await findUserByEmail(email)
        if (user) {
            throwJsonError(409, 'Ya existe un usuario con ese email')
        }

        const passwordHash = await bcrypt.hash(password, 12)

        const verificationCode = randomstring.generate(64)

        const userDB = {
            nameUser,
            email,
            passwordHash,
            verificationCode,
            phone,
        }

        if (image) {
            const imageName = `${nameUser.replace(
                / /g,
                '_'
            )}_${randomstring.generate(10)}${path.extname(image.name)}`
            const imagePath = `${pathProfileImageFolder}/${imageName}`
            image.mv(imagePath, err => {
                if (err) {
                    throwJsonError(500, 'Error al guardar la imagen')
                }
            })
            userDB.image = `${HTTP_SERVER}/${PATH_USER_IMAGE}/${imageName}`
        }

        const userId = await createUser(userDB)

        await sendMailRegister(nameUser, email, verificationCode)

        console.log(userDB)

        res.status(201)
        res.send({
            idUser: userId,
        })
    } catch (error) {
        createJsonError(error, res)
    }
}

module.exports = registerUser
