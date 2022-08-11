// const axios = require("axios");
const { Router } = require("express");
// const { Character } = require("../db");

const {
  getAllCharacters,
  getCharacterById,
} = require("../controllers/characters.controllers");

const router = Router();

// Configurar los routers

router.get("/characters", getAllCharacters);
router.get("/characters/:idChar", getCharacterById);

module.exports = router;
