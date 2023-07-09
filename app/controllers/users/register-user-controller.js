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

const validExtensions = ['.jpeg', '.jpg', '.png']

const { HTTP_SERVER, PATH_USER_IMAGE } = process.env

async function registerUser(req, res) {
    try {
        const { body } = req
        console.log(body)
        await schema.validateAsync(body)
        const { nameUser, email, password, phone } = body

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
            const { image } = body
            const extension = path.extname(image.name)

            if (!validExtensions.includes(extension)) {
                throwJsonError(400, 'Formato no válido')
            }

            const pathProfileImageFolder = `${__dirname}/../../../public/${PATH_USER_IMAGE}`

            if (user.image) {
                await fs.unlink(
                    `${pathProfileImageFolder}/${user.image}`,
                    () => {}
                )
            }

            const random = randomstring.generate(10)

            const imageName = `${random}-${random}${extension}`
            const imagePath = `${pathProfileImageFolder}/${imageName}`
            const imageUrl = `${HTTP_SERVER}/${PATH_USER_IMAGE}/${imageName}`

            image.mv(imagePath, async function (err) {
                if (err) {
                    throwJsonError(500, 'Error al guardar la imagen')
                }
            })

            userDB.image = imageUrl
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
