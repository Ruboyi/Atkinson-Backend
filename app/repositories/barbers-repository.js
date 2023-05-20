"use strict";

const getPool = require("../infrastructure/database-infrastructure");

async function getAllBarbers() {
  const pool = await getPool();
  const sql = `SELECT * FROM barbers`;
  const [barbers] = await pool.query(sql);
  return barbers;
}


module.exports = {
  getAllBarbers,
};
