'use strict'

const createJsonError = require('../../errors/create-json-error')
const throwJsonError = require('../../errors/throw-json-error')
const { getAllBarbers } = require('../../repositories/barbers-repository')
const { getAllSchedules } = require('../../repositories/schedules-repository')

async function getBarbers(req, res) {
    try {
        // Llamar a la función del repositorio para obtener la lista de barberos
        const barbers = await getAllBarbers()

        // Validar el resultado
        if (!barbers || barbers.length === 0) {
            throwJsonError('No se encontraron barberos', 404, res)
            return
        }
        const allSchedules = await getAllSchedules()

        if (!allSchedules || allSchedules.length === 0) {
            throwJsonError('No se encontraron horarios', 404, res)
            return
        }

        // Mapear la lista de barberos y agregar el horario correspondiente
        const barbersWithSchedule = barbers.map(barber => {
            const schedule = allSchedules.find(
                schedule => schedule.idSchedule === barber.idSchedule
            )
            return {
                ...barber,
                schedule,
            }
        })

        // Enviar la respuesta con la lista de barberos
        res.status(200)
        res.send({ data: barbersWithSchedule })
    } catch (error) {
        createJsonError(error, res)
    }
}

module.exports = getBarbers
