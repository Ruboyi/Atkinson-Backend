'use strict'

const getPool = require('../infrastructure/database-infrastructure')

async function createNotification(userId, title, message) {
    const pool = await getPool()
    const sql = `
      INSERT INTO notifications (idUser, title, message)
      VALUES (?, ?, ?)
    `
    const [result] = await pool.query(sql, [userId, title, message])
    return result.insertId
}

async function getNotificationsByUserId(userId) {
    const pool = await getPool()
    const sql = `
    SELECT * FROM notifications WHERE idUser = ?
    `
    const [result] = await pool.query(sql, [userId])
    return result
}

//Borrar notificaciones por id
async function deleteNotificationById(idNotification) {
    const pool = await getPool()
    const sql = `
    DELETE FROM notifications WHERE idNotification = ?
    `
    const [result] = await pool.query(sql, [idNotification])
    return result
}

//Actualizar como leidas todas las notificaciones de un usuario
async function updateNotificationsByUserId(userId) {
    const pool = await getPool()
    const sql = `
    UPDATE notifications SET viewed = 1 WHERE idUser = ?
    `
    const [result] = await pool.query(sql, [userId])
    return result
}

module.exports = {
    createNotification,
    getNotificationsByUserId,
    deleteNotificationById,
    updateNotificationsByUserId,
}
