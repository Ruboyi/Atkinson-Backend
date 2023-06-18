'use strict'

const Joi = require('joi')
const {
    findAppoimentsByBarberIdAndDate,
} = require('../../repositories/appointment-repository')
const createJsonError = require('../../errors/create-json-error')
const throwJsonError = require('../../errors/throw-json-error')
const {
    findAppoimentsById,
    updateAppoimnetByAppoimentId,
} = require('../../repositories/appointment-repository')
const { getAppoimentsByAppointmentId } = require('../../helpers/utils')

const schema = Joi.object().keys({
    idAppointment: Joi.number().integer().positive().required(),
    idService: Joi.number().integer().positive().required(),
    appointmentDate: Joi.date().required(),
})

async function updateAppointementAdmin(req, res) {
    try {
        const { role } = req.auth

        if (role !== 'admin') throwJsonError(401, 'Acceso denegado')

        const { body } = req
        await schema.validateAsync(body)
        const { idAppointment, idService, appointmentDate } = body

        const appointment = await findAppoimentsById(idAppointment)

        if (!appointment) throwJsonError(400, 'La cita no existe')

        //Si la fecha es la misma no se comprueba nada y solo se actualiza el servicio
        if (
            new Date(appointment.appointmentDate).getTime() ===
            new Date(appointmentDate).getTime()
        ) {
            await updateAppoimnetByAppoimentId({
                idAppointment,
                idService,
                appointmentDate,
            })
            res.send({ idAppointment, idService, appointmentDate })
            return
        }

        //Comprobar que no haya otra cita a la misma hora con el mismo barbero
        const appointments = await findAppoimentsByBarberIdAndDate(
            appointment.idBarber,
            appointmentDate
        )

        if (appointments.length > 0)
            throwJsonError(400, 'El barbero ya tiene una cita a esa hora')

        await updateAppoimnetByAppoimentId({
            idAppointment,
            idService,
            appointmentDate,
        })
        const io = req.app.get('socketio')

        const appointmentsByAppointmentId = await getAppoimentsByAppointmentId(
            idAppointment
        )

        io.emit('updateAppointment', appointmentsByAppointmentId)

        res.send({ idAppointment, idService, appointmentDate })
    } catch (err) {
        createJsonError(err, res)
    }
}

module.exports = updateAppointementAdmin
