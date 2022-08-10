const axios = require("axios");
const { Router } = require("express");
const { Character } = require("../db");

const router = Router();

// Configurar los routers

router.get("/characters", async (req, res) => {
  const quantity = 30;
  let characters = [];

  let api = await axios.get("https://rickandmortyapi.com/api/character");

  characters = [...api.data.results];

  if (quantity > 20) {
    let apiAux = api;
    let cantidad = quantity % characters.length; //3

    if (cantidad === 0) cantidad = undefined;

    for (let i = 0; characters.length < quantity; i++) {
      let api2;
      api2 = await axios.get(apiAux.data.info.next);
      apiAux = api2;
      if (quantity - characters.length < 20) {
        characters = [...characters, ...api2.data.results.slice(0, cantidad)];
        break;
      }
      characters = [...characters, ...api2.data.results];
    }
  }

  characters = characters.filter((char) => {
    let obj = {
      id: char.id,
      name: char.name,
      species: char.species,
      origin: char.origin.name,
      image: char.image,
      created: char.created,
    };

    return obj;
  });

  return res.send(characters);
});

module.exports = router;
