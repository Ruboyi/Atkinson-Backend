const getPool = require('../infrastructure/database-infrastructure');

async function createAppointment(appointmentData) {
  const pool = await getPool();

  const {
    userId,
    barberId,
    appointmentDate,
    serviceId,
  } = appointmentData;

  const sql = `
    INSERT INTO appointments (idUser, idBarber, appointmentDate, idService)
    VALUES (?, ?, ?, ?)
  `;
  const values = [userId, barberId, appointmentDate, serviceId ];

  const [result] = await pool.query(sql, values);

  return result.insertId;
}

module.exports = {
  createAppointment
};
