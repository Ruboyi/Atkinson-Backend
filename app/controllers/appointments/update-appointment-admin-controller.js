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
const logger = require('../../logs/logger')
const { sendMailCitaActualizada } = require('../../helpers/mail-smtp-SendGrid')
const { findUserById } = require('../../repositories/users-repository')
const { default: Expo } = require('expo-server-sdk')
const {
    createNotification,
} = require('../../repositories/notifications-repository')

const schema = Joi.object().keys({
    idAppointment: Joi.number().integer().positive().required(),
    idService: Joi.number().integer().positive().required(),
    idBarber: Joi.number().integer().positive().required(),
    appointmentDate: Joi.date().required(),
})

async function updateAppointementAdmin(req, res) {
    try {
        const { role } = req.auth

        if (role !== 'admin') throwJsonError(401, 'Acceso denegado')

        logger.info(
            `Admin con id: ${req.auth.idUser} actualizando cita con ${req.body}`
        )

        const { body } = req
        await schema.validateAsync(body)
        const { idAppointment, idService, appointmentDate, idBarber } = body

        const appointment = await findAppoimentsById(idAppointment)

        if (!appointment) throwJsonError(400, 'La cita no existe')

        //Comprobar que no haya otra cita a la misma hora con el mismo barbero

        const appointments = await findAppoimentsByBarberIdAndDate(
            idBarber,
            appointmentDate
        )

        if (
            appointments.length > 0 &&
            appointments[0].idAppointment !== idAppointment
        )
            throwJsonError(400, 'El barbero ya tiene una cita a esa hora')

        //Comprobar que esa hora no haya pasado

        if (new Date(appointmentDate).getTime() < new Date().getTime())
            throwJsonError(400, 'La hora de la cita ya ha pasado')

        await updateAppoimnetByAppoimentId({
            idAppointment,
            idService,
            appointmentDate,
            idBarber,
        })
        const io = req.app.get('socketio')

        const appointmentsByAppointmentId = await getAppoimentsByAppointmentId(
            idAppointment
        )

        io.emit('updateAppointment', appointmentsByAppointmentId)

        logger.info(
            `Admin con id: ${req.auth.idUser} ha actualizado la cita al usuario con id: ${appointmentsByAppointmentId.idUser} y con id de cita: ${appointmentsByAppointmentId.idAppointment}`
        )

        const user = await findUserById(appointmentsByAppointmentId.idUser)
        const { nameUser, email } = user

        const expo = new Expo()
        const expoPushToken = user.pushToken
        const title = 'Cita actualizada'
        const messageBody = `Hola ${nameUser}, tu cita ha sido actualizada a las ${appointmentDate}, por favor contacte con la barbería para más información.`

        const messages = [
            {
                to: expoPushToken,
                title: title,
                sound: 'default',
                body: messageBody,
                data: { extraData: 'Some data' },
            },
        ]

        if (Expo.isExpoPushToken(expoPushToken)) {
            const chunks = expo.chunkPushNotifications(messages)
            const tickets = []
            for (const chunk of chunks) {
                try {
                    const ticketChunk = await expo.sendPushNotificationsAsync(
                        chunk
                    )
                    tickets.push(...ticketChunk)
                    await createNotification(
                        appointmentsByAppointmentId.idUser,
                        title,
                        messageBody
                    )
                } catch (error) {
                    logger.error(
                        `Error al enviar las notificaciones a los administradores de la app`,
                        error
                    )
                }
            }
            logger.info(
                `Usuario con id: ${appointmentsByAppointmentId.idUser} ha recibido una notificación de cita actualizada`
            )
        }

        await sendMailCitaActualizada(nameUser, email, appointmentDate)

        res.send({ idAppointment, idService, appointmentDate })
    } catch (err) {
        const { body } = req
        logger.error(
            `Error al actualizar la cita con id ${body.idAppointment}`,
            err
        )
        createJsonError(err, res)
    }
}

module.exports = updateAppointementAdmin
