'use strict'

const getPool = require('../infrastructure/database-infrastructure')

async function getAllBarberShops() {
    const pool = await getPool()
    const sql = `SELECT * FROM barberShops`
    const [barberShops] = await pool.query(sql)
    return barberShops
}

async function getBarberShopById(idBarberShop) {
    const pool = await getPool()
    const sql = `SELECT * FROM barberShops WHERE idBarberShop = ?`
    const [barberShop] = await pool.query(sql, idBarberShop)
    return barberShop[0]
}

module.exports = {
    getAllBarberShops,
    getBarberShopById,
}
