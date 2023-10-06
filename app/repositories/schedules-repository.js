'use strict'

const getPool = require('../infrastructure/database-infrastructure')

async function getAllSchedules() {
    const pool = await getPool()
    const sql = `SELECT * FROM schedules`
    const [schedules] = await pool.query(sql)
    return schedules
}

async function getAllSchedulesNew() {
    const pool = await getPool()
    const sql = `SELECT * FROM schedule_barbers`
    const [schedules] = await pool.query(sql)
    return schedules
}

module.exports = {
    getAllSchedules,
    getAllSchedulesNew,
}
