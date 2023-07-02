'use strict'

const createJsonError = require('../../errors/create-json-error')
const throwJsonError = require('../../errors/throw-json-error')
const {
    getAppoimentsByUserId,
} = require('../../repositories/appointment-repository')
const { getAllBarbers } = require('../../repositories/barbers-repository')
const { getAllServices } = require('../../repositories/services-repository')

async function getAppoimentsByUser(req, res) {
    try {
        const idUser = req.auth.idUser

        if (!idUser) throwJsonError(404, 'No se encontró el id del usuario')

        const appointments = await getAppoimentsByUserId(idUser)

        const barbers = await getAllBarbers()
        const services = await getAllServices()

        //Machear los barberos y los servicios con los appointments para poner el nombre
        const formattedAppointments = appointments.map(appointment => {
            const barber = barbers.find(
                barber => barber.idBarber === appointment.idBarber
            )
            const service = services.find(
                service => service.idService === appointment.idService
            )
            return {
                appointmentId: appointment.idAppointment,
                barber: { barberId: barber.idBarber, barberName: barber.name },
                service: {
                    serviceId: service.idService,
                    serviceName: service.name,
                },
                appointmentDate: appointment.appointmentDate,
                createdAt: appointment.createdAt,
            }
        })

        res.status(200)
        res.send({ data: formattedAppointments })
    } catch (error) {
        console.log(error)
        createJsonError(error, res)
    }
}

module.exports = getAppoimentsByUser
