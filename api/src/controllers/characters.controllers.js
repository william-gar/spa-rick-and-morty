const axios = require("axios");
const { Character, Episode } = require("../db");

// Characters API ---------------------------------------------
const getCharactersApi = async (req, res) => {
  const quantity = 60;
  let charactersApi = [];

  try {
    let api = await axios.get("https://rickandmortyapi.com/api/character");
    charactersApi = [...api.data.results];

    // Get more than 20 characters. Change value in constant quantity.
    if (quantity > 20) {
      let apiAux = api;
      let residue = quantity % charactersApi.length;

      if (residue === 0) residue = undefined;

      for (let i = 0; charactersApi.length < quantity; i++) {
        let api2;
        api2 = await axios.get(apiAux.data.info.next);
        apiAux = api2;

        if (quantity - charactersApi.length < 20) {
          charactersApi = [
            ...charactersApi,
            ...api2.data.results.slice(0, residue),
          ];
          break;
        }

        charactersApi = [...charactersApi, ...api2.data.results];
      }
    }

    // Format
    charactersApi = charactersApi.map((char) => {
      const { id, name, species, origin, image, created, episode } = char;
      const obj = {
        id,
        name,
        species,
        origin: origin.name,
        image,
        created,
        episodes: episode.map((ep) => {
          let arr = ep.split("/");
          let numEpisode = arr[arr.length - 1] * 1;
          return numEpisode;
        }),
      };

      return obj;
    });

    return charactersApi;
  } catch (error) {
    console.log(`Error getting characters from API: ${error}`);
  }
};
//-------------------------------------------------------------

// Characters DataBase ----------------------------------------
const getCharactersDb = async () => {
  try {
    const charactersDb = await Character.findAll({
      include: [{ model: Episode }],
    });

    return charactersDb;
  } catch (error) {
    console.log(`Error getting characters from database: ${error}`);
  }
};
//-------------------------------------------------------------

// GET All Characters - API + DB ------------------------------
const getAllCharacters = async (req, res) => {
  const { name } = req.query;

  const apiCharacters = await getCharactersApi();
  const dbCharacters = await getCharactersDb();
  const allCharacters = [...apiCharacters, ...dbCharacters];

  try {
    if (name) {
      const nameFound = allCharacters.find(
        (char) => char.name.toLowerCase() === name.toLowerCase()
      );

      if (nameFound) return res.send(nameFound);
      else return res.status(404).send(`${name} character not found`);
    }

    return res.send(allCharacters);
  } catch (error) {
    return res
      .status(400)
      .send(
        `An error occurred while trying to get all the characters. ${error}`
      );
  }
};
//-------------------------------------------------------------

// GET CHARACTER BY ID

const getCharacterById = async (req, res) => {
  const { idChar } = req.params;

  const apiCharacters = await getCharactersApi();
  const dbCharacters = await getCharactersDb();
  const allCharacters = [...apiCharacters, ...dbCharacters];

  try {
    if (idChar) {
      const idFound = allCharacters.find((char) => char.id == idChar);

      if (idFound) return res.send(idFound);
      else {
        let characterId = await axios.get(
          `https://rickandmortyapi.com/api/character/${idChar}`
        );

        let { id, name, species, origin, image, created } = characterId.data;

        const obj = {
          id,
          name,
          species,
          origin: origin.name,
          image,
          created,
        };

        return res.send(obj);
      }
    }
  } catch (error) {
    return res
      .status(404)
      .send(`Character with id:${idChar} not found. ${error}`);
  }
};
//-------------------------------------------------------------

// POST Character
const postCharacter = async (req, res) => {
  const { name, species, origin, image, episodes } = req.body;
  const validator =
    name && species && origin && image && episodes ? true : false;

  if (!validator) return res.status(400).send(`Some data is missing!`);

  try {
    const obj = { name, species, origin, image };
    const newCharacter = await Character.create(obj);

    newCharacter.addEpisodes(episodes);

    return res.send(`${name} character created successfully!`);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getAllCharacters, getCharacterById, postCharacter };
