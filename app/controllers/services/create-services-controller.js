'use strict'

const Joi = require('joi')
const logger = require('../../logs/logger')
const { createService } = require('../../repositories/services-repository')
const createJsonError = require('../../errors/create-json-error')
const throwJsonError = require('../../errors/throw-json-error')

const schema = Joi.object().keys({
    name: Joi.string().required(),
    price: Joi.number().integer().positive().required(),
})

async function createServiceController(req, res) {
    try {
        const { role } = req.auth
        const { body } = req
        const { name, price } = body

        if (role !== 'admin') throwJsonError(401, 'Acceso denegado')

        logger.info(`Creando servicio con nombre ${name} y precio ${price}`)

        await schema.validateAsync(body)

        const idService = await createService(name, price)

        logger.info(`Servicio creado con id ${idService}`)

        res.status(201)

        res.send({
            idService: idService,
        })
    } catch (error) {
        logger.error(error.message)
        createJsonError(error, res)
    }
}

module.exports = createServiceController
