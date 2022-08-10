// const axios = require("axios");
const { Router } = require("express");
// const { Character } = require("../db");

const getAllCharacters = require("../controllers/characters.controllers");

const router = Router();

// Configurar los routers

router.get("/characters", getAllCharacters);

module.exports = router;
