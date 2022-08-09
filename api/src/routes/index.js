const { default: axios } = require("axios");
const { Router } = require("express");
const { Character } = require("../db");

const router = Router();

// Configurar los routers

router.get("/characters", async (req, res) => {
  const api = await axios.get("https://rickandmortyapi.com/api/character");
});

module.exports = router;
