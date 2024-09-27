const createJsonError = require('../../errors/create-json-error')
const throwJsonError = require('../../errors/throw-json-error')
const logger = require('../../logs/logger')
const {
    getServicesByBarber,
} = require('../../repositories/services-repository')

async function getServicesByBarberController(req, res) {
    try {
        const { idBarber } = req.params

        if (!idBarber) {
            throwJsonError('El id del barbero es requerido.', 400)
        }

        const services = await getServicesByBarber(idBarber)

        if (services.length === 0) {
            throwJsonError(
                `No se encontraron servicios para el barbero con id: ${idBarber}.`,
                404
            )
        }
        logger.info(
            `Se obtuvieron los servicios del barbero con id: ${idBarber}`
        )

        res.status(200).json(services)
    } catch (error) {
        const { idBarber } = req.params

        logger.error(
            `Error al obtener los servicios del barbero con id: ${idBarber}`,
            error
        )

        createJsonError(error, res)
    }
}

module.exports = getServicesByBarberController
