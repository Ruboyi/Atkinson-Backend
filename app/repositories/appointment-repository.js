const { date } = require('joi')
const getPool = require('../infrastructure/database-infrastructure')

async function createAppointment(appointmentData) {
    const pool = await getPool()

    const { idUser, barberId, appointmentDate, serviceId } = appointmentData

    const sql = `
    INSERT INTO appointments (idUser, idBarber, appointmentDate, idService)
    VALUES (?, ?, ?, ?)
  `
    const values = [idUser, barberId, appointmentDate, serviceId]

    const [result] = await pool.query(sql, values)

    return result.insertId
}
// Dame todas las citas desde el dia de hoy
async function getAppoiments(date) {
    const pool = await getPool()
    const sql = `SELECT * FROM appointments WHERE appointmentDate >= ?`
    const [appointments] = await pool.query(sql, date)
    return appointments
}

async function getAppoimentsByBarberId(barberId) {
    const pool = await getPool()
    const sql = `SELECT * FROM appointments WHERE idBarber = ?`
    const [appointments] = await pool.query(sql, barberId)
    return appointments
}

async function getAppoimentsByBarberIdAndDate(barberId, date) {
    const pool = await getPool()
    const sql = `SELECT * FROM appointments WHERE idBarber = ? AND appointmentDate >= ?`
    const [appointments] = await pool.query(sql, [barberId, date])
    return appointments
}

// Traer todos los appointments de un usuario desde la fecha actual
async function getAppoimentsByUserId(userId) {
    const pool = await getPool()
    const sql = `SELECT * FROM appointments WHERE idUser = ? AND appointmentDate >= ?`
    const [appointments] = await pool.query(sql, [userId, new Date()])
    return appointments
}

//Borrar un appointment por id
async function deleteAppointmentById(idAppointment) {
    const pool = await getPool()
    const sql = `DELETE FROM appointments WHERE idAppointment = ?`
    await pool.query(sql, idAppointment)
    return true
}

module.exports = {
    createAppointment,
    getAppoimentsByBarberId,
    getAppoimentsByBarberIdAndDate,
    getAppoimentsByUserId,
    deleteAppointmentById,
    getAppoiments,
}
