'use strict'

const { getAppoimentsById } = require('../repositories/appointment-repository')
const { getAllBarbers } = require('../repositories/barbers-repository')
const { getAllServices } = require('../repositories/services-repository')
const { findUserById } = require('../repositories/users-repository')

function isAdmin(role) {
    if (role !== 'admin') {
        const error = new Error('No tienes permisos para realizar esta acción')
        error.status = 401

        throw error
    }

    return true
}

const getAppoimentsByAppointmentId = async idAppointment => {
    const appointment = await getAppoimentsById(idAppointment)
    const barbers = await getAllBarbers()
    const services = await getAllServices()

    const barber = barbers.find(
        barber => barber.idBarber === appointment.idBarber
    )
    const service = services.find(
        service => service.idService === appointment.idService
    )
    const user = await findUserById(appointment.idUser)

    const appoimentEdit = {
        id: appointment.idAppointment,
        barber: barber.name,
        idBarber: appointment.idBarber,
        idService: appointment.idService,
        service: service.name,
        date: appointment.appointmentDate,
        createdAt: appointment.createdAt,
        idUser: appointment.idUser,
        image: user.image,
        user: user.nameUser,
        phone: user.phone,
    }
    return appoimentEdit
}

module.exports = {
    isAdmin,
    getAppoimentsByAppointmentId,
}
