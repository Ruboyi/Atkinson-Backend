'use strict'

const getPool = require('../infrastructure/database-infrastructure')

async function getAllBarberShops() {
    const pool = await getPool()
    const sql = `SELECT * FROM barbershops`
    const [barberShops] = await pool.query(sql)
    return barberShops
}

async function getBarberShopById(idBarberShop) {
    const pool = await getPool()
    const sql = `SELECT * FROM barberShops WHERE idBarbershop = ?`
    const [barberShop] = await pool.query(sql, idBarberShop)
    return barberShop[0]
}

module.exports = {
    getAllBarberShops,
    getBarberShopById,
}
