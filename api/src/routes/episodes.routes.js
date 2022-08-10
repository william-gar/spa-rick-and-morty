const { Router } = require("express");
const getEpisodes = require("../controllers/episodes.controllers");

const router = Router();

// Configurar los routers

router.get("/episodes", getEpisodes);

module.exports = router;
