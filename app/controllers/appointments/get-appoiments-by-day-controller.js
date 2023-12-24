'use strict'

const createJsonError = require('../../errors/create-json-error')
const throwJsonError = require('../../errors/throw-json-error')
const logger = require('../../logs/logger')
const {
    getAppoimentsByDate,
} = require('../../repositories/appointment-repository')
const { getAllBarbers } = require('../../repositories/barbers-repository')
const { getAllServices } = require('../../repositories/services-repository')
const { findUserById } = require('../../repositories/users-repository')

async function getAppoimnetsbyDay(req, res) {
    try {
        const { role } = req.auth
        const { date, idBarbershop } = req.query

        console.log('idBarbershop', idBarbershop)

        if (role !== 'admin') throwJsonError(401, 'Acceso denegado')

        logger.info(
            `Admin con id ${req.auth.idUser} solicitando  todos las citas del día ${date}`
        )

        if (!date) throwJsonError(400, 'La fecha es requerida')

        const appointments = await getAppoimentsByDate(date, idBarbershop)

        const barbers = await getAllBarbers()
        const services = await getAllServices()

        const newAppointments = await Promise.all(
            appointments.map(async appointment => {
                const barber = barbers.find(
                    barber => barber.idBarber === appointment.idBarber
                )
                const service = services.find(
                    service => service.idService === appointment.idService
                )

                const user = await findUserById(appointment.idUser)

                const isUserApp = !!user.email

                return {
                    id: appointment.idAppointment,
                    barber: barber.name,
                    idBarber: barber.idBarber,
                    idService: service.idService,
                    service: service.name,
                    date: appointment.appointmentDate,
                    createdAt: appointment.createdAt,
                    image: user.image,
                    isUserApp: isUserApp,
                    idUser: user.idUser,
                    user: user.nameUser,
                    phone: user.phone,
                }
            })
        )

        logger.info(
            `Admin con id ${req.auth.idUser} ha recibido todos las citas del día ${date} correctamente`
        )

        res.status(200)
        res.send({ data: newAppointments })
    } catch (error) {
        logger.error(`Error al obtener todos las citas del día`, error)
        createJsonError(error, res)
    }
}

module.exports = getAppoimnetsbyDay
