'use strict'

const Joi = require('joi')

const {
    uploadUserProfileImage,
} = require('../../repositories/users-repository')
const createJsonError = require('../../errors/create-json-error')

const logger = require('../../logs/logger')

const schema = Joi.object().keys({
    url: Joi.string().required(),
})

async function updateUserUrlImagePublic(req, res) {
    try {
        const { body } = req
        const { idUser } = req.params

        await schema.validateAsync(body)

        const { url } = body

        logger.info(
            `Usuario con id: ${idUser} actualizadon su foto de perfil con url  ${url}`
        )
        await uploadUserProfileImage(idUser, url)

        logger.info(
            `Usuario con id: ${idUser} actualizadon su foto de perfil con url  ${url}, correctamente`
        )

        res.send({ url: url })
    } catch (err) {
        const { idUser } = req.auth
        logger.error(
            `Usuario con id: ${idUser} no ha podido actualizar su foto de perfil`
        )
        createJsonError(err, res)
    }
}

module.exports = updateUserUrlImagePublic
