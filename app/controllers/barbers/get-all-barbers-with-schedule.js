'use strict'

const createJsonError = require('../../errors/create-json-error')
const throwJsonError = require('../../errors/throw-json-error')
const logger = require('../../logs/logger')
const { getAllBarbers } = require('../../repositories/barbers-repository')
const {
    getAllSchedulesNew,
} = require('../../repositories/schedules-repository')

async function getBarbers(req, res) {
    try {
        const { idUser } = req.auth

        logger.info(`Usuario con id: ${idUser} ha solicitado lista de barberos`)
        // Llamar a la función del repositorio para obtener la lista de barberos
        const barbers = await getAllBarbers()

        // Validar el resultado
        if (!barbers || barbers.length === 0) {
            throwJsonError('No se encontraron barberos', 404, res)
            return
        }
        const allSchedules = await getAllSchedulesNew()

        if (!allSchedules || allSchedules.length === 0) {
            throwJsonError('No se encontraron horarios', 404, res)
            return
        }

        // Mapear la lista de barberos y agregar el horario correspondiente
        const barbersWithSchedule = barbers.map(barber => {
            const schedules = allSchedules.filter(
                schedule => schedule.idSchedule === barber.idSchedule
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
        res.send({ data: barbersWithSchedule })
    } catch (error) {
        logger.error(`Error al obtener lista de barberos`, error)
        createJsonError(error, res)
    }
}

module.exports = getBarbers
