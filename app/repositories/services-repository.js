'use strict'

const getPool = require('../infrastructure/database-infrastructure')

async function getAllServices() {
    const pool = await getPool()
    const sql = 'SELECT * FROM services'
    const [services] = await pool.query(sql)
    return services
}

async function getServices(idBarbershop) {
    const pool = await getPool()
    const sql = `
        SELECT 
            services.idService,
            services.name,
            barbershop_services.price
        FROM services
        INNER JOIN barbershop_services ON services.idService = barbershop_services.service_id
        WHERE barbershop_services.barbershop_id = ? AND services.DeletionStatus = 0;
    `
    const [services] = await pool.query(sql, [idBarbershop])
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

async function getServicesByBarber(idBarber, idBarbershop) {
    const pool = await getPool()
    const sql = `
        SELECT 
            services.idService,
            services.name,
            barbershop_services.price
        FROM services
        INNER JOIN barber_services ON services.idService = barber_services.idService
        INNER JOIN barbershop_services ON services.idService = barbershop_services.service_id
        WHERE barber_services.idBarber = ? AND barbershop_services.barbershop_id = ?;
    `
    const [rows] = await pool.query(sql, [idBarber, idBarbershop])
    return rows
}

module.exports = {
    getAllServices,
    getServiceById,
    createService,
    deleteService,
    updateService,
    getServicesByBarber,
    getServices,
}
