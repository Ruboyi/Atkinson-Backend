'use strict'

const createJsonError = require('../../errors/create-json-error')
const throwJsonError = require('../../errors/throw-json-error')
const {
    getAppoimentsByDate,
} = require('../../repositories/appointment-repository')
const { getAllBarbers } = require('../../repositories/barbers-repository')
const { getAllServices } = require('../../repositories/services-repository')
const { findUserById } = require('../../repositories/users-repository')

async function getAppoimnetsbyDay(req, res) {
    try {
        const { role } = req.auth

        if (role !== 'admin') throwJsonError(401, 'Acceso denegado')

        const { date } = req.query

        if (!date) throwJsonError(400, 'La fecha es requerida')

        const appointments = await getAppoimentsByDate(date)

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

                return {
                    id: appointment.idAppointment,
                    barber: barber.name,
                    idBarber: barber.idBarber,
                    idService: service.idService,
                    service: service.name,
                    date: appointment.appointmentDate,
                    createdAt: appointment.createdAt,
                    user: user.nameUser,
                    phone: user.phone,
                }
            })
        )

        res.status(200)
        res.send({ data: newAppointments })
    } catch (error) {
        createJsonError(error, res)
    }
}

module.exports = getAppoimnetsbyDay
