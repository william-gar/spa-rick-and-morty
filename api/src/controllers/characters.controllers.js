const axios = require("axios");
const { Character } = require("../db");

const getCharactersApi = async (req, res) => {
  const quantity = 33;
  let charactersApi = [];

  let api = await axios.get("https://rickandmortyapi.com/api/character");

  charactersApi = [...api.data.results];

  if (quantity > 20) {
    let apiAux = api;
    let cantidad = quantity % charactersApi.length; //3

    if (cantidad === 0) cantidad = undefined;

    for (let i = 0; charactersApi.length < quantity; i++) {
      let api2;
      api2 = await axios.get(apiAux.data.info.next);
      apiAux = api2;
      if (quantity - charactersApi.length < 20) {
        charactersApi = [
          ...charactersApi,
          ...api2.data.results.slice(0, cantidad),
        ];
        break;
      }
      charactersApi = [...charactersApi, ...api2.data.results];
    }
  }

  charactersApi = charactersApi.map((char) => {
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

  return charactersApi;
};

const getAllCharacters = async (req, res) => {
  const { name } = req.query;

  if (name) return res.send({ name: name });

  const allCharacters = await getCharactersApi();

  return res.send(allCharacters);
};

module.exports = getAllCharacters;
