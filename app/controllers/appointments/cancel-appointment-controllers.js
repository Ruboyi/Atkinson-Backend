'use strict'

const { default: Expo } = require('expo-server-sdk')
const createJsonError = require('../../errors/create-json-error')
const throwJsonError = require('../../errors/throw-json-error')
const { sendMailCitaCancelada } = require('../../helpers/mail-smtp-SendGrid')
const logger = require('../../logs/logger')
const {
    deleteAppointmentById,
    getAppoimentsByUserId,
    findAppoimentsById,
} = require('../../repositories/appointment-repository')
const { findUserById } = require('../../repositories/users-repository')
const {
    createNotification,
} = require('../../repositories/notifications-repository')

const MINIMUM_CANCELLATION_HOURS = 24

async function cancelAppointmentById(req, res) {
    try {
        const { idUser } = req.auth
        const { role } = req.auth
        const { idAppointment } = req.params

        if (role !== 'admin') {
            logger.info(
                `El usuario con id: ${idUser} cancelando la cita con id: ${idAppointment}`
            )

            if (!idAppointment)
                throwJsonError(404, 'No se encontró el id de la cita')

            const appointments = await getAppoimentsByUserId(idUser)

            if (!appointments || appointments.length === 0)
                return throwJsonError(404, 'No se encontraron citas')

            const appointment = appointments.find(
                appointment =>
                    appointment.idAppointment === Number(idAppointment)
            )

            if (!appointment)
                return throwJsonError(404, 'No se encontró la cita')

            const now = new Date()
            const citaDate = new Date(appointment.appointmentDate)
            const differenceInTime = citaDate.getTime() - now.getTime()
            const differenceInHours = Math.ceil(
                differenceInTime / (1000 * 3600)
            )

            if (differenceInHours < MINIMUM_CANCELLATION_HOURS)
                throwJsonError(
                    400,
                    `No se puede cancelar la cita. Debe haber al menos ${MINIMUM_CANCELLATION_HOURS} horas de anticipación.`
                )
        }
        const appointment = await findAppoimentsById(idAppointment)

        await deleteAppointmentById(idAppointment)

        const io = req.app.get('socketio')

        io.emit('cancelAppointment', Number(idAppointment))

        logger.info(
            `El usuario con id: ${idUser} ha cancelado la cita con id: ${idAppointment}`
        )
        if (role === 'admin') {
            const user = await findUserById(appointment.idUser)
            //Enviar notificación al usuario
            const expo = new Expo()
            const expoPushToken = user.pushToken
            const title = 'Cita cancelada'
            const message = `Su cita con ${user.nameBarber} ha sido cancelada, por favor contacte con la barbería para más información.`

            const messages = [
                {
                    to: expoPushToken,
                    sound: 'default',
                    title: title,
                    body: message,
                    data: { withSome: 'data' },
                },
            ]
            if (Expo.isExpoPushToken(expoPushToken)) {
                const chunks = expo.chunkPushNotifications(messages)
                const tickets = []
                for (const chunk of chunks) {
                    try {
                        const ticketChunk =
                            await expo.sendPushNotificationsAsync(chunk)
                        tickets.push(...ticketChunk)
                        await createNotification(
                            appointment.idUser,
                            title,
                            message
                        )
                    } catch (error) {
                        logger.error(
                            `Error al enviar las notificaciones a los administradores de la app`,
                            error
                        )
                    }
                }
                logger.info(
                    `El usuario con id: ${idUser} ha recibido una notificación de cancelación de cita`
                )
            }
            await sendMailCitaCancelada(user.nameUser, user.email)
            logger.info(
                `El usuario con id: ${idUser} ha recibido un mail de cancelación de cita`
            )
        }

        res.status(200).send({ message: 'Cita cancelada' })
    } catch (error) {
        const { idAppointment } = req.params
        logger.error(
            `Error al cancelar la cita con id: ${idAppointment}`,
            error
        )

        createJsonError(error, res)
    }
}

module.exports = cancelAppointmentById
