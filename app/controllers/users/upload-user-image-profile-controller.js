'use strict'

const createJsonError = require('../../errors/create-json-error')
const throwJsonError = require('../../errors/throw-json-error')
const randomstring = require('randomstring')
const path = require('path')
const fs = require('fs')
const {
    findUserProfileImage,
    uploadUserProfileImage,
} = require('../../repositories/users-repository')
const logger = require('../../logs/logger')

const validExtensions = ['.jpeg', '.jpg', '.png']

async function uploadImageProfile(req, res) {
    try {
        const { idUser } = req.auth
        const { files } = req

        if (!files || Object.keys(files).length === 0) {
            throwJsonError(400, 'No se ha selecionado ningún fichero')
        }

        logger.info(
            `El usuario con id: ${idUser} subiendo una imagen de perfil`
        )

        const { profileImage } = files
        const extension = path.extname(profileImage.name)

        if (!validExtensions.includes(extension)) {
            throwJsonError(400, 'Formato no valido')
        }

        const { HTTP_SERVER, PATH_USER_IMAGE } = process.env
        const user = await findUserProfileImage(idUser)
        const pathProfileImageFolder = `${__dirname}/../../../public/${PATH_USER_IMAGE}`

        if (user.image) {
            await fs.unlink(`${pathProfileImageFolder}/${user.image}`, () => {})
        }

        const random = randomstring.generate(10)

        const imageName = `${idUser}-${random}${extension}`
        const pathImage = `${pathProfileImageFolder}/${imageName}`
        const url = `${HTTP_SERVER}/${PATH_USER_IMAGE}/${imageName}`

        profileImage.mv(pathImage, async function (err) {
            if (err) return res.status(500).send(err)
            await uploadUserProfileImage(idUser, url)
        })

        logger.info(
            `El usuario con id: ${idUser} ha subido una imagen de perfil`
        )

        res.status(200)
        res.send({ url: url })
    } catch (error) {
        const { idUser } = req.auth
        logger.error(
            `Error al subir una imagen de perfil el usuario con id: ${idUser}`,
            error
        )

        createJsonError(error, res)
    }
}

module.exports = uploadImageProfile
