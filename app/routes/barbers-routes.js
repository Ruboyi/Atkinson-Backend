"use strict";

const express = require("express");
const validateAuth = require("../middlewares/validate-auth");
const getBarbers = require("../controllers/barbers/get-all-barbers-controller");


const router = express.Router();

// Rutas públicas
router.route("/barbers").all(validateAuth).get(getBarbers);


// Rutas privadas
// router.route("/").all(validateAuth).post(createBarber);
// router.route("/:barberId").all(validateAuth).put(updateBarber).delete(deleteBarber);

module.exports = router;