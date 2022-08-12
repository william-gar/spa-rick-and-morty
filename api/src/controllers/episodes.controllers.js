const axios = require("axios");
const { Episode } = require("../db");

const loadEpisodes = async (n, db = false) => {
  const quantity = n;
  let episodes = [];

  const api = await axios("https://rickandmortyapi.com/api/episode");

  episodes = [...api.data.results];

  if (quantity > 20 && quantity <= 51) {
    let apiAux = api;
    let residue = quantity % episodes.length;

    if (residue === 0) residue = undefined;

    for (let i = 0; episodes.length < quantity; i++) {
      let api2;
      api2 = await axios.get(apiAux.data.info.next);
      apiAux = api2;

      if (quantity - episodes.length < 20) {
        episodes = [...episodes, ...api2.data.results.slice(0, residue)];
        break;
      }

      episodes = [...episodes, ...api2.data.results];
    }
  }

  // Format
  episodes = episodes.map((char) => {
    const { id, name } = char;
    const obj = {
      id,
      name,
    };

    return obj;
  });

  if (db) await Episode.bulkCreate(episodes);

  return episodes;
};

// GET - EPISODES
const getEpisodes = async (req, res) => {
  // const episodes = await loadEpisodes(51);

  const episodes = await Episode.findAll();

  return res.send(episodes);
};

module.exports = { getEpisodes, loadEpisodes };
