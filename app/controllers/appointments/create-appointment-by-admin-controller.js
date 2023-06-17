const Joi = require('joi')
const {
    createAppointment,
    findAppointmentsByBarberIdAndDate,
    findAppoimentsByBarberIdAndDate,
} = require('../../repositories/appointment-repository')
const createJsonError = require('../../errors/create-json-error')
const throwJsonError = require('../../errors/throw-json-error')
const { createUserByAdmin } = require('../../repositories/users-repository')
const { getAppoimentsByAppointmentId } = require('../../helpers/utils')

const schema = Joi.object().keys({
    barberId: Joi.number().required(),
    appointmentDate: Joi.date().required(),
    serviceId: Joi.number().required(),
    nameUser: Joi.string().min(3).max(120),
    phone: Joi.string().min(9).max(12),
    idUser: Joi.number(),
})

async function createAppointmentByAdminController(req, res) {
    try {
        const { body, auth } = req
        const { role } = auth

        if (role !== 'admin') {
            throwJsonError(
                403,
                'No tienes permisos para crear citas como administrador'
            )
        }
        await schema.validateAsync(body)

        const newAppointment = {
            ...body,
            idUser: body.idUser || null,
        }

        if (!newAppointment.idUser) {
            // Crear nuevo usuario si no se proporciona el idUser
            const userId = await createUserByAdmin({
                nameUser: body.nameUser,
                phone: body.phone,
            })
            if (!userId) {
                throwJsonError(400, 'No se pudo crear el usuario para la cita')
            }

            newAppointment.idUser = userId
        }

        // Comprobar si ya tiene una cita a esa hora
        const appointments = await findAppoimentsByBarberIdAndDate(
            newAppointment.barberId,
            newAppointment.appointmentDate
        )

        if (appointments.length > 0) {
            throwJsonError(400, 'El barbero ya tiene una cita a esa hora')
        }

        const appointmentId = await createAppointment(newAppointment)

        if (!appointmentId) {
            throwJsonError(400, 'No se pudo crear la cita')
        }

        const appoimentEdit = await getAppoimentsByAppointmentId(appointmentId)

        const io = req.app.get('socketio')
        io.emit('newAppointment', appoimentEdit)

        res.status(201).json({ idAppointment: appointmentId })
    } catch (error) {
        createJsonError(error, res)
    }
}

module.exports = createAppointmentByAdminController
