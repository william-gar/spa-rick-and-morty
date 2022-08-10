const axios = require("axios");

const getEpisodes = async (req, res) => {
  const episodes = await axios("https://rickandmortyapi.com/api/episode");

  return res.send(episodes.data.results);
};

module.exports = getEpisodes;
