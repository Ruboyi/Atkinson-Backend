'use strict'

const getPool = require('../infrastructure/database-infrastructure')

async function getAllServices() {
    const pool = await getPool()
    const sql = 'SELECT * FROM services WHERE DeletionStatus = 0'
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
    return createdService.insertId
}

async function updateService(name, price, idService) {
    const pool = await getPool()
    const sql = 'UPDATE services SET name = ?, price = ? WHERE idService = ?'
    const [updatedService] = await pool.query(sql, [name, price, idService])
    return updatedService.insertId
}

async function deleteService(idService) {
    const pool = await getPool()
    const sql = 'UPDATE services SET DeletionStatus = 1 WHERE idService = ?'
    await pool.query(sql, idService)
}

async function getServicesByBarber(idBarber) {
    const pool = await getPool()
    const sql = `
        SELECT *
        FROM services
        INNER JOIN barber_services ON services.idService = barber_services.idService
        WHERE barber_services.idBarber = ?;
    `
    const [rows] = await pool.query(sql, [idBarber])
    return rows // Devuelve los servicios asociados al barbero
}

module.exports = {
    getAllServices,
    getServiceById,
    createService,
    deleteService,
    updateService,
    getServicesByBarber,
}
