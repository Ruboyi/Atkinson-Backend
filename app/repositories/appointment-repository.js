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
    const sql = `SELECT * FROM appointments WHERE appointmentDate >= ? AND canceled = 0`
    const [appointments] = await pool.query(sql, date)
    return appointments
}

//Dame todas las citas de un dia especifico
async function getAppoimentsByDate(date) {
    const pool = await getPool()
    const init = date + ' 00:00:00'
    const end = date + ' 23:59:59'
    const sql = `SELECT * FROM appointments WHERE appointmentDate BETWEEN ? AND ? AND canceled = 0`
    const [appointments] = await pool.query(sql, [init, end])
    return appointments
}

async function getAppoimentsByBarberId(barberId) {
    const pool = await getPool()
    const sql = `SELECT * FROM appointments WHERE idBarber = ? AND canceled = 0`
    const [appointments] = await pool.query(sql, barberId)
    return appointments
}

async function getAppoimentsByBarberIdAndDate(barberId, date) {
    const pool = await getPool()
    const sql = `SELECT * FROM appointments WHERE idBarber = ? AND appointmentDate >= ? AND canceled = 0`
    const [appointments] = await pool.query(sql, [barberId, date])
    return appointments
}

//Comprobar si ya tiene una cita a esa hora
async function findAppoimentsByBarberIdAndDate(barberId, date) {
    const pool = await getPool()
    const sql = `SELECT * FROM appointments WHERE idBarber = ? AND appointmentDate = ? AND canceled = 0`
    const [appointments] = await pool.query(sql, [barberId, date])
    return appointments
}

// Traer todos los appointments de un usuario desde la fecha actual
async function getAppoimentsByUserId(userId) {
    const pool = await getPool()
    const sql = `SELECT * FROM appointments WHERE idUser = ? AND appointmentDate >= ? AND canceled = 0`
    const [appointments] = await pool.query(sql, [userId, new Date()])
    return appointments
}
// Traer todos los appointments de un usuario desde antes de la fecha actual
async function getNumberOfAppointmentsByUserIdBeforeNow(userId) {
    const pool = await getPool()
    const sql = `SELECT COUNT(*) AS appointmentCount FROM appointments WHERE idUser = ? AND appointmentDate <= ? AND canceled = 0`
    const [result] = await pool.query(sql, [userId, new Date()])
    const appointmentCount = result[0].appointmentCount
    return appointmentCount
}

// Traer numero de citas canceladas de un usuario
async function getNumberOfAppointmentsCanceledByUserId(userId) {
    const pool = await getPool()
    const sql = `SELECT COUNT(*) AS appointmentCount FROM appointments WHERE idUser = ? AND canceled = 1`
    const [result] = await pool.query(sql, userId)
    const appointmentCount = result[0].appointmentCount
    return appointmentCount
}

//Buscar appointments por id
async function findAppoimentsById(idAppointment) {
    const pool = await getPool()
    const sql = `SELECT * FROM appointments WHERE idAppointment = ? AND canceled = 0`
    const [appointments] = await pool.query(sql, idAppointment)
    return appointments[0]
}

//Borrardo logico appointment por id
async function deleteAppointmentById(idAppointment) {
    const pool = await getPool()
    const sql = `UPDATE appointments SET canceled = 1 WHERE idAppointment = ?`
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
    const sql = `SELECT * FROM appointments WHERE idAppointment = ? AND canceled = 0`
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
    getAppoimentsByDate,
    getNumberOfAppointmentsByUserIdBeforeNow,
    getNumberOfAppointmentsCanceledByUserId,
}
