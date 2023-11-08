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

    const isUserApp = !!user.email

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
        isUserApp: isUserApp,
        phone: user.phone,
    }
    return appoimentEdit
}

function formatDate(fecha) {
    const year = fecha.getFullYear()
    const month = String(fecha.getMonth() + 1).padStart(2, '0') // Suma 1 al mes ya que los meses comienzan en 0
    const day = String(fecha.getDate()).padStart(2, '0')
    const hours = String(fecha.getHours()).padStart(2, '0')
    const minutes = String(fecha.getMinutes()).padStart(2, '0')

    return `${year}/${month}/${day} ${hours}:${minutes}`
}

module.exports = {
    isAdmin,
    getAppoimentsByAppointmentId,
    formatDate,
}
