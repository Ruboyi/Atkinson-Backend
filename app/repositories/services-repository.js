"use strict";

const getPool = require("../infrastructure/database-infrastructure");

async function getAllServices() {
  const pool = await getPool();
  const sql = "SELECT * FROM services";
  const [services] = await pool.query(sql);
  return services;
}

module.exports = {
  getAllServices,
};