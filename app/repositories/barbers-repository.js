'use strict'

const getPool = require('../infrastructure/database-infrastructure')

async function getAllBarbers() {
    const pool = await getPool()
    const sql = `SELECT * FROM barbers`
    const [barbers] = await pool.query(sql)
    return barbers
}
// dame el barbero por id
async function getBarberById(idBarber) {
    const pool = await getPool()
    const sql = `SELECT * FROM barbers WHERE idBarber = ?`
    const [barber] = await pool.query(sql, idBarber)
    return barber[0]
}

module.exports = {
    getAllBarbers,
    getBarberById,
}
