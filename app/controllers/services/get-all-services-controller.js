const createJsonError = require("../../errors/create-json-error");
const throwJsonError = require("../../errors/throw-json-error");
const { getAllServices } = require('../../repositories/services-repository');

async function getAllServicesController(req, res) {
  try {
    const services = await getAllServices();

    // Verificar si se encontraron servicios
    if (services.length === 0) {
      throwJsonError('No se encontraron servicios.', 404);
    }

    res.status(200).json(services);
  } catch (error) {
    createJsonError(error, res);
  }
}

module.exports = getAllServicesController;
