'use strict'

const createJsonError = require('../')
const throwJsonError = require('../')
const logger = require('../../logs/logger')
const { getHolidaysByYear } = require('../../repositories/holidays-repository')

async function getHolidays(req, res) {
    try {
        const { year } = req.params

        logger.info(
            `Usuario ha solicitado obtener los festivos del año ${year}`
        )

        const holidays = await getHolidaysByYear(year)

        if (!holidays) throwJsonError(404, 'No se encontraron festivos')

        logger.info(
            `   Usuario ha obtenido los festivos del año ${year} correctamente`
        )

        res.status(200)
        res.send(holidays)
    } catch (error) {
        createJsonError(error, res)
    }
}

module.exports = getHolidays
