'use strict'

const getPool = require('../infrastructure/database-infrastructure')

async function getAllBarbers() {
    const pool = await getPool()
    const sql = `SELECT * FROM barbers WHERE isDelete = 0`
    const [barbers] = await pool.query(sql)
    return barbers
}
// dame el barbero por id
async function getBarberById(idBarber) {
    const pool = await getPool()
    const sql = `SELECT * FROM barbers WHERE idBarber = ? AND isDelete = 0`
    const [barber] = await pool.query(sql, idBarber)
    return barber[0]
}

async function getAllBarbersByIdBarbershops(idBarbershop) {
    const pool = await getPool()
    const sql = `SELECT * FROM barbers WHERE idBarbershop = ? AND isDelete = 0`
    const [barbers] = await pool.query(sql, idBarbershop)
    return barbers
}

module.exports = {
    getAllBarbers,
    getBarberById,
    getAllBarbersByIdBarbershops,
}
