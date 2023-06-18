const Joi = require('joi')
const {
    createAppointment,
    findAppoimentsByBarberIdAndDate,
} = require('../../repositories/appointment-repository')
const createJsonError = require('../../errors/create-json-error')
const throwJsonError = require('../../errors/throw-json-error')
const { getAppoimentsByAppointmentId } = require('../../helpers/utils')

const schema = Joi.object().keys({
    barberId: Joi.number().required(),
    appointmentDate: Joi.date().required(),
    serviceId: Joi.number().required(),
})

async function createAppointmentController(req, res) {
    try {
        const { body } = req
        const { idUser } = req.auth

        await schema.validateAsync(body)

        const newAppointment = {
            ...body,
            idUser: idUser,
        }

        //Comprobar si ya tiene una cita a esa hora
        const appointments = await findAppoimentsByBarberIdAndDate(
            newAppointment.barberId,
            newAppointment.appointmentDate
        )

        if (appointments.length > 0) {
            throwJsonError(400, 'El barbero ya tiene una cita a esa hora')
        }

        const appointment = await createAppointment(newAppointment)
        const io = req.app.get('socketio')

        const appointmentsByAppointmentId = await getAppoimentsByAppointmentId(
            appointment
        )

        io.emit('newAppointment', appointmentsByAppointmentId)

        res.status(201).json({ idAppointment: appointment })
    } catch (error) {
        if (error.name === 'ValidationError') {
            throwJsonError(400, 'Invalid appointment data')
        } else {
            createJsonError(error, res)
        }
    }
}

module.exports = createAppointmentController
