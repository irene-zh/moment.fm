const config = require('../db-config.js');
const mysql = require('mysql');

config.connectionLimit = 10;
const connection = mysql.createPool(config);

/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */

const getSong = (req, res) => {
  const query = ``;

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });
};

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

const getIGotAFeeling = (req, res) => {
  const query = `
  WITH got_a_feeling AS (
    SELECT s.acousticness, s.danceability, s.liveness, s.loudness
    FROM song s
    WHERE s.name = "I got a Feeling" 
    AND s.artist_name = "Black Eyed Peas"
  )
  SELECT s.id, s.title AS title, s.artist AS artist, s.year AS year
  FROM song s, got_a_feeling
  WHERE ABS(s.acousticness - got_a_feeling.acousticness) < .05
  AND ABS(s.danceability - got_a_feeling.danceability) < .05
  AND ABS(s.liveness - got_a_feeling.liveness) < .05
  AND ABS(s.loudness - got_a_feeling.loudness) < .05
  AND s.name <> "I got a Feeling"
  LIMIT 5
  `;

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });
};

module.exports = {
  getSong: getSong,
	getArtist: getArtist,
	getRecommendedArtists: getRecommendedArtists,
  getRecommendedSongs: getRecommendedSongs,
  getIGotAFeeling: getIGotAFeeling
};