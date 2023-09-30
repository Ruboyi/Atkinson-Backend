'use strict'

const getPool = require('../infrastructure/database-infrastructure')

async function getHolidaysByYear(year) {
    const pool = await getPool()
    const sql = `SELECT date, name FROM holidays WHERE YEAR(date) = ?`
    const [holidays] = await pool.query(sql, year)
    return holidays
}

module.exports = {
    getHolidaysByYear,
}
