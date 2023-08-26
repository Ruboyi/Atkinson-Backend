'use strict'

const Joi = require('joi')
const logger = require('../../logs/logger')
const { updateService } = require('../../repositories/services-repository')
const createJsonError = require('../../errors/create-json-error')
const throwJsonError = require('../../errors/throw-json-error')

const schema = Joi.object().keys({
    name: Joi.string().required(),
    price: Joi.number().integer().positive().required(),
})

async function updateServiceController(req, res) {
    try {
        const { role } = req.auth
        const { idService } = req.params
        const { body } = req
        const { name, price } = body

        if (role !== 'admin') throwJsonError(401, 'Acceso denegado')

        logger.info(
            `Editando servicio con id: ${idService} nombre ${name} y precio ${price}`
        )

        await schema.validateAsync(body)

        const serviceId = await updateService(name, price)

        logger.info(`Servicio con id ${serviceId} modificado`)

        res.status(200)

        res.send({
            idService: idService,
        })
    } catch (error) {
        logger.error(error.message)
        createJsonError(error, res)
    }
}

module.exports = updateServiceController
