"use strict";

const createJsonError = require("../../errors/create-json-error");
const throwJsonError = require("../../errors/throw-json-error");
const { getAppoimentsByBarberId } = require("../../repositories/appointment-repository");


async function getAllAppoimnetsByBarberId(req, res) {
  try {
    const idBarber = req.auth.idUser;
    
    if(!idBarber) throwJsonError('No se encontró el id del barbero', 404)
    
    const appointments = await getAppoimentsByBarberId(idBarber);

    res.status(200)
    res.send({ data: appointments })
  } catch (error) {
    createJsonError(error, res);
  }
}

module.exports = getAllAppoimnetsByBarberId;