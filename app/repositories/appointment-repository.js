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

//Comprobar si ya tiene una cita a esa hora
async function findAppoimentsByBarberIdAndDate(barberId, date) {
    const pool = await getPool()
    const sql = `SELECT * FROM appointments WHERE idBarber = ? AND appointmentDate = ?`
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
//Buscar appointments por id
async function findAppoimentsById(idAppointment) {
    const pool = await getPool()
    const sql = `SELECT * FROM appointments WHERE idAppointment = ?`
    const [appointments] = await pool.query(sql, idAppointment)
    return appointments[0]
}

//Borrar un appointment por id
async function deleteAppointmentById(idAppointment) {
    const pool = await getPool()
    const sql = `DELETE FROM appointments WHERE idAppointment = ?`
    await pool.query(sql, idAppointment)
    return true
}

async function updateAppoimnetByAppoimentId(appointmentData) {
    const pool = await getPool()
    const { idAppointment, idService, appointmentDate } = appointmentData
    const sql = `UPDATE appointments SET idService = ?, appointmentDate = ? WHERE idAppointment = ?`
    await pool.query(sql, [idService, appointmentDate, idAppointment])
    return true
}

async function getAppoimentsById(idAppointment) {
    const pool = await getPool()
    const sql = `SELECT * FROM appointments WHERE idAppointment = ?`
    const [appointments] = await pool.query(sql, idAppointment)
    return appointments[0]
}

module.exports = {
    createAppointment,
    getAppoimentsByBarberId,
    getAppoimentsByBarberIdAndDate,
    findAppoimentsByBarberIdAndDate,
    getAppoimentsByUserId,
    deleteAppointmentById,
    updateAppoimnetByAppoimentId,
    getAppoiments,
    findAppoimentsById,
    getAppoimentsById,
}
