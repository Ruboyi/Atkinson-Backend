'use strict'

const createJsonError = require('../../errors/create-json-error')
const throwJsonError = require('../../errors/throw-json-error')
const logger = require('../../logs/logger')
const {
    getAllBarbersByIdBarbershops,
} = require('../../repositories/barbers-repository')
const {
    getAllSchedulesNew,
} = require('../../repositories/schedules-repository')

async function getBarbersByIdBarbershops(req, res) {
    try {
        const { idUser } = req.auth
        const { idBarbershop } = req.params
        logger.info(`Usuario con id: ${idUser} ha solicitado lista de barberos`)
        const barbers = await getAllBarbersByIdBarbershops(idBarbershop)

        if (!barbers || barbers.length === 0) {
            throwJsonError(404, 'No se encontraron barberos')
            return
        }

        const allSchedules = await getAllSchedulesNew()

        if (!allSchedules || allSchedules.length === 0) {
            throwJsonError(404, 'No se encontraron horarios')
            return
        }

        const barbersWithSchedule = barbers.map(barber => {
            const schedules = allSchedules.filter(
                schedule => barber.idBarber === schedule.idBarber
            )
            return {
                ...barber,
                schedules: schedules,
            }
        })
        logger.info(
            `Usuario con id: ${idUser} ha recibido lista de barberos correctamente`
        )
        res.status(200)
        res.send({
            data: barbersWithSchedule,
        })
    } catch (error) {
        logger.error(`Error al obtener lista de barberos`, error)
        createJsonError(error, res)
    }
}

module.exports = getBarbersByIdBarbershops
