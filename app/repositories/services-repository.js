'use strict'

const getPool = require('../infrastructure/database-infrastructure')

async function getAllServices() {
    const pool = await getPool()
    const sql = 'SELECT * FROM services'
    const [services] = await pool.query(sql)
    return services
}

async function getServiceById(idService) {
    const pool = await getPool()
    const sql = 'SELECT * FROM services WHERE idService = ?'
    const [service] = await pool.query(sql, idService)
    return service[0]
}

async function createService(name, price) {
    const pool = await getPool()
    const sql = 'INSERT INTO services (name, price) VALUES (?, ?)'
    const [createdService] = await pool.query(sql, [name, price])
    return createdService
}

module.exports = {
    getAllServices,
    getServiceById,
    createService,
}
