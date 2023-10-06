'use strict'

const getPool = require('../infrastructure/database-infrastructure')

//Si es isDelete es 1 no mostrarlo

async function getAllSchedules() {
    const pool = await getPool()
    const sql = `SELECT * FROM schedules WHERE isDelete = 0`
    const [schedules] = await pool.query(sql)
    return schedules
}

async function getAllSchedulesNew() {
    const pool = await getPool()
    const sql = `SELECT * FROM schedule_barbers WHERE isDelete = 0`
    const [schedules] = await pool.query(sql)
    return schedules
}

module.exports = {
    getAllSchedules,
    getAllSchedulesNew,
}
