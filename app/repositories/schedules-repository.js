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

async function editSheduleById(schedule) {
    const { startTime, endTime, freeDay, id } = schedule
    const pool = await getPool()
    const sql = `
        UPDATE schedule_barbers
        SET startTime = ?,
            endTime = ?,
            freeDay = ?
        WHERE id = ?`
    const [schedules] = await pool.query(sql, [startTime, endTime, freeDay, id])
    return schedules
}

module.exports = {
    getAllSchedules,
    getAllSchedulesNew,
    editSheduleById,
}
