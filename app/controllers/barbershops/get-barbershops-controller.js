'use strict'

const createJsonError = require('../../errors/create-json-error')
const throwJsonError = require('../../errors/throw-json-error')
const logger = require('../../logs/logger')
const {
    getAllBarberShops,
} = require('../../repositories/barbershops-repository')

async function getBarbershops(req, res) {
    try {
        const { idUser } = req.auth

        logger.info(
            `Usuario con id: ${idUser} ha solicitado lista de barberias`
        )

        const barberShops = await getAllBarberShops()

        if (!barberShops || barberShops.length === 0) {
            throwJsonError('No se encontraron barberias', 404, res)
            return
        }

        logger.info(
            `Usuario con id: ${idUser} ha recibido lista de barberias correctamente`
        )

        res.status(200)
        res.send({ data: barberShops })
    } catch (error) {
        logger.error(`Error al obtener lista de barberias`, error)
        createJsonError(error, res)
    }
}

module.exports = getBarbershops
