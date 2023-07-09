'use strict'

const createJsonError = require('../../errors/create-json-error')
const throwJsonError = require('../../errors/throw-json-error')
const {
    deleteAppointmentById,
    getAppoimentsByUserId,
} = require('../../repositories/appointment-repository')

const MINIMUM_CANCELLATION_HOURS = 24

async function cancelAppointmentById(req, res) {
    try {
        const idUser = req.auth.idUser

        const { idAppointment } = req.params

        if (!idAppointment)
            throwJsonError(404, 'No se encontró el id de la cita')

        const appointments = await getAppoimentsByUserId(idUser)

        if (!appointments || appointments.length === 0)
            return throwJsonError(404, 'No se encontraron citas')

        const appointment = appointments.find(
            appointment => appointment.idAppointment === Number(idAppointment)
        )

        if (!appointment) return throwJsonError(404, 'No se encontró la cita')

        const now = new Date()
        const citaDate = new Date(appointment.appointmentDate)
        const differenceInTime = citaDate.getTime() - now.getTime()
        const differenceInHours = Math.ceil(differenceInTime / (1000 * 3600))

        if (differenceInHours < MINIMUM_CANCELLATION_HOURS)
            throwJsonError(
                400,
                `No se puede cancelar la cita. Debe haber al menos ${MINIMUM_CANCELLATION_HOURS} horas de anticipación.`
            )

        await deleteAppointmentById(idAppointment)

        const io = req.app.get('socketio')

        io.emit('cancelAppointment', Number(idAppointment))

        res.status(200).send({ message: 'Cita cancelada' })
    } catch (error) {
        console.log(error)
        createJsonError(error, res)
    }
}

module.exports = cancelAppointmentById
