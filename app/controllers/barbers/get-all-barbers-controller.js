"use strict";

const createJsonError = require("../../errors/create-json-error");
const throwJsonError = require("../../errors/throw-json-error");
const { getAllBarbers } = require("../../repositories/barbers-repository");

async function getBarbers(req, res) {
  try {
    // Llamar a la función del repositorio para obtener la lista de barberos
    const barbers = await getAllBarbers();

    // Validar el resultado
    if (!barbers || barbers.length === 0) {
      throwJsonError('No se encontraron barberos', 404, res);
      return;
    }

    // Enviar la respuesta con la lista de barberos
    res.status(200)
    res.send({ data: barbers })
  } catch (error) {
    createJsonError(error, res);
  }
}

module.exports = getBarbers;