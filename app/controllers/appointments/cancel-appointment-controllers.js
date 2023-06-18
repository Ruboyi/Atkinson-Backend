'use strict'

const createJsonError = require('../../errors/create-json-error')
const throwJsonError = require('../../errors/throw-json-error')
const {
    deleteAppointmentById,
    getAppoimentsByUserId,
} = require('../../repositories/appointment-repository')

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
