'use strict'

const createJsonError = require('../../errors/create-json-error')
const throwJsonError = require('../../errors/throw-json-error')
const logger = require('../../logs/logger')
const { getAppoiments } = require('../../repositories/appointment-repository')
const { getAllBarbers } = require('../../repositories/barbers-repository')
const { getAllServices } = require('../../repositories/services-repository')
const { findUserById } = require('../../repositories/users-repository')
const getUserById = require('../users/get-user-by-id-controller')

async function getAllAppoimnets(req, res) {
    try {
        const { role } = req.auth
        if (role !== 'admin') throwJsonError(401, 'Acceso denegado')

        const date = new Date().toISOString().split('T')[0]

        logger.info(
            `Admin con id ${req.auth.idUser} solicitando todos las citas del día ${date}`
        )
        const appointments = await getAppoiments(date)

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
                    user: user.nameUser,
                    phone: user.phone,
                }
            })
        )
        logger.info(
            `Admin con id ${req.auth.idUser} ha recibido todas las citas del día ${date} correctamente`
        )

        res.status(200)
        res.send({ data: newAppointments })
    } catch (error) {
        logger.error(`Error al obtener lista de citas agendadas`, error)
        createJsonError(error, res)
    }
}

module.exports = getAllAppoimnets
