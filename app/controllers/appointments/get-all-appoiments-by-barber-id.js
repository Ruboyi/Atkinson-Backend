'use strict'

const createJsonError = require('../../errors/create-json-error')
const throwJsonError = require('../../errors/throw-json-error')
const logger = require('../../logs/logger')
const {
    getAppoimentsByBarberIdAndDate,
} = require('../../repositories/appointment-repository')

async function getAllAppoimnetsByBarberId(req, res) {
    try {
        const { idUser } = req.auth
        const { idBarber } = req.params

        logger.info(
            `El usuario con id: ${idUser} ha accedido a todas las citas del barbero con id: ${idBarber}`
        )

        if (!idBarber) throwJsonError('No se encontró el id del barbero', 404)

        const appointments = await getAppoimentsByBarberIdAndDate(
            Number(idBarber),
            new Date().toISOString()
        )

        logger.info(
            `El usuario con id: ${idUser} ha recibido todas las citas del barbero con id: ${idBarber}`
        )

        res.status(200)
        res.send({ data: appointments })
    } catch (error) {
        const { idBarber } = req.params
        logger.error(
            `Error al obtener todas las citas del barbero con id: ${idBarber}`,
            error
        )
        createJsonError(error, res)
    }
}

module.exports = getAllAppoimnetsByBarberId
