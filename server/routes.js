const config = require('./db-config.js');
const mysql = require('mysql');

config.connectionLimit = 10;
const connection = mysql.createPool(config);

/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */

const getArtist = (req, res) => {
  const query = ``;

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });
};

const getRecommendedSongs = (req, res) => {
  const query = ``;

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });
};

const getRecommendedArtists = (req, res) => {
  const query = ``;

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });
};

module.exports = {
	getArtist: getArtist,
	getRecommendedArtists: getRecommendedArtists,
  getRecommendedSongs: getRecommendedSongs
};