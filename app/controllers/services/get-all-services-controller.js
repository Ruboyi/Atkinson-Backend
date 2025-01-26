const createJsonError = require('../../errors/create-json-error')
const throwJsonError = require('../../errors/throw-json-error')
const logger = require('../../logs/logger')
const { getServices } = require('../../repositories/services-repository')

async function getAllServicesController(req, res) {
    try {
        const { idUser } = req.auth
        const { idBarbershop } = req.params

        if (!idUser) {
            throwJsonError(400, 'El id del usuario es requerido.')
        }
        if (!idBarbershop) {
            throwJsonError(400, 'El id de la barbería es requerido.')
        }

        const services = await getServices(idBarbershop)

        if (services.length === 0) {
            throwJsonError('No se encontraron servicios.', 404)
        }
        logger.info(
            `Usuario con id: ${idUser} ha accedido a todos los servicios`
        )

        res.status(200).json(services)
    } catch (error) {
        logger.error(`Error al obtener todos los servicios`, error)
        createJsonError(error, res)
    }
}

module.exports = getAllServicesController
