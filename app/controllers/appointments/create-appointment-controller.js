const Joi = require('joi')
const {
    createAppointment,
    findAppoimentsByBarberIdAndDate,
    getAppoimentsByUserId,
} = require('../../repositories/appointment-repository')
const createJsonError = require('../../errors/create-json-error')
const throwJsonError = require('../../errors/throw-json-error')
const {
    getAppoimentsByAppointmentId,
    formatDate,
} = require('../../helpers/utils')
const logger = require('../../logs/logger')
const { Expo } = require('expo-server-sdk')
const {
    getAllExpoPushTokenAdmin,
    findUserById,
    findAbsencesByIdUser,
} = require('../../repositories/users-repository')

const { getBarberById } = require('../../repositories/barbers-repository')
const { getServiceById } = require('../../repositories/services-repository')

const MAX_APPOINTMENTS_PER_USER = 2
const LIMIT_ABSENCES = 2
const TLF_ADMIN = '608 19 44 32'

const schema = Joi.object().keys({
    barberId: Joi.number().required(),
    appointmentDate: Joi.date().required(),
    serviceId: Joi.number().required(),
    barbershopId: Joi.number().required(),
})

async function createAppointmentController(req, res) {
    try {
        const { body } = req
        const { idUser } = req.auth

        logger.info(
            `Usuario con id: ${idUser} solicitando una cita con ${body}`
        )

        await schema.validateAsync(body)

        const newAppointment = {
            ...body,
            idUser: idUser,
        }

        const userAppointments = await getAppoimentsByUserId(idUser)

        if (
            userAppointments.length >= MAX_APPOINTMENTS_PER_USER &&
            idUser !== 561 &&
            idUser !== 615 &&
            idUser !== 1716
        ) {
            //Usuarios con varios niños identificado por el id pertmite más citas
            throwJsonError(
                400,
                `No se puede realizar la reserva. Ya tienes el máximo de ${MAX_APPOINTMENTS_PER_USER} citas.`
            )
        }

        //Comprobar si ya tiene una cita a esa hora
        const appointments = await findAppoimentsByBarberIdAndDate(
            newAppointment.barberId,
            newAppointment.appointmentDate
        )

        if (appointments.length > 0) {
            throwJsonError(400, 'El barbero ya tiene una cita a esa hora')
        }

        if (
            newAppointment.serviceId === '13' ||
            newAppointment.serviceId === '14'
        ) {
            //Lo mismo con la media hora siguiente
            const appointmentDate = new Date(newAppointment.appointmentDate)
            appointmentDate.setMinutes(appointmentDate.getMinutes() + 30)
            const date = formatDate(appointmentDate)
            const appointments2 = await findAppoimentsByBarberIdAndDate(
                newAppointment.barberId,
                date
            )
            if (appointments2.length > 0) {
                throwJsonError(
                    400,
                    'La duracion del servicio seleccionado es de 1 hora. El barbero ya tiene una cita a la hora siguiente'
                )
            }
        }

        //Comprobar si tiene más de 1 ausencias
        const absences = await findAbsencesByIdUser(idUser)
        if (absences >= LIMIT_ABSENCES) {
            console.log('entro')
            throwJsonError(
                400,
                `Tienes ${absences} ausencias registradas. Por favor, contacta con el administrador para poder reservar una cita. Tlf: ${TLF_ADMIN}`
            )
        }

        const appointment = await createAppointment(newAppointment)
        const io = req.app.get('socketio')

        const appointmentsByAppointmentId = await getAppoimentsByAppointmentId(
            appointment
        )

        io.emit('newAppointment', appointmentsByAppointmentId)

        logger.info(
            `Usuario con id: ${idUser} ha solicitado una cita con ${body}`
        )

        // Envío de notificación a los administradores
        const expo = new Expo()
        const adminTokens = await getAllExpoPushTokenAdmin()
        const user = await findUserById(idUser)
        const barber = await getBarberById(body.barberId)
        const service = await getServiceById(body.serviceId)

        // Crear los mensajes a enviar a los administradores
        const messages = adminTokens.map(pushToken => ({
            to: pushToken.pushToken,
            sound: 'default',
            title: 'Cita confirmada con la app',
            body: `${user.nameUser} ha reservado una cita para el ${body.appointmentDate} ${service.name} con ${barber.name} `,
            data: { withSome: 'data' },
        }))

        const chunks = expo.chunkPushNotifications(messages)
        const tickets = []

        for (const chunk of chunks) {
            try {
                const ticketChunk = await expo.sendPushNotificationsAsync(chunk)
                tickets.push(...ticketChunk)
            } catch (error) {
                console.error(error)
                logger.error(
                    `Error al enviar las notificaciones a los administradores de la app`,
                    error
                )
            }
        }
        logger.info(
            `Se han enviando las notificaciones a los administradores de la app`
        )

        res.status(201).json({ idAppointment: appointment })
    } catch (error) {
        logger.error(`Error al crear la cita`, error)
        if (error.name === 'ValidationError') {
            throwJsonError(400, 'Invalid appointment data')
        } else {
            createJsonError(error, res)
        }
    }
}

module.exports = createAppointmentController
