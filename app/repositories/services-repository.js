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

module.exports = {
    getAllServices,
    getServiceById,
}
