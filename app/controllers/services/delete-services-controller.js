const createJsonError = require('../../errors/create-json-error')
const throwJsonError = require('../../errors/throw-json-error')
const logger = require('../../logs/logger')
const { deleteService } = require('../../repositories/services-repository')

async function DeleteServicesController(req, res) {
    try {
        const { role } = req.auth
        const { idService } = req.params

        if (role !== 'admin') throwJsonError(401, 'Acceso denegado')

        logger.info(`Eliminando servicio con id ${idService}`)
        await deleteService(idService)

        logger.info(`Servicio eliminado con id ${idService}`)

        res.status(200).send({ idService })
    } catch (error) {
        logger.error('Error al eliminar el servicio', error.message)
        createJsonError(error, res)
    }
}

module.exports = DeleteServicesController
