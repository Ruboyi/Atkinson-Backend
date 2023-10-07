const createJsonError = require('../../errors/create-json-error')
const throwJsonError = require('../../errors/throw-json-error')
const logger = require('../../logs/logger')
const { editSheduleById } = require('../../repositories/schedules-repository')

//el schema sera un arry de objetos
const schema = Joi.array().items(
    Joi.object().keys({
        startTime: Joi.string().required(),
        endTime: Joi.string().required(),
        freeDay: Joi.number().required(),
        idBarber: Joi.number().required(),
        id: Joi.number().required(),
        dayOfWeek: Joi.number().required(),
    })
)

async function updateShedyleById(req, res) {
    try {
        const { role } = req.auth
        const { body } = req

        if (role !== 'admin') {
            throwJsonError('No tienes permisos para editar horarios', 403)
        }

        await schema.validateAsync(body)

        for (const schedule of body) {
            await editSheduleById(schedule)
        }

        logger.info(`Horarios editados correctamente`)

        res.status(200).json({ message: 'Horarios editados correctamente' })
    } catch (error) {
        logger.error(`Error al editar los horarios`, error)
        createJsonError(error, res)
    }
}

module.exports = updateShedyleById
