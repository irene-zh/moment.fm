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
  const query = `WITH convert_to_decade AS (
    SELECT s.year - (s.year % 10) as decade
    FROM song s
  ),
  most_active AS (
    SELECT s.decade
    FROM artists a
    JOIN song s
    ON s.artist_name = a.name
    WHERE a.name = ${artist_name}
    GROUP BY s.decade
    ORDER BY COUNT(s.decade) DESC
    LIMIT 1
  ),
  top_genres AS (
    SELECT s.genre
    FROM artist a
    JOIN song s 
    ON a.name = s.artist_name
  WHERE a.name = ${artist_name}
    GROUP BY s.genre
    ORDER BY COUNT(s.genre) DESC
    LIMIT 5
  ),
  same_decade AS (
    SELECT a.name as name, COUNT(s.name) AS decade_cnt
    FROM artists a
    JOIN song s
    ON a.name = s.artist_name
    WHERE s.year >= most_active
    AND s.year <= most_active + 9
    GROUP BY s.artist_name
  ),
  In_genre_helper AS (
  SELECT 1 as n, s.artist AS artist_name
  FROM song s
  WHERE s.genre IN top_genres
  )
  same_genres AS (
    SELECT a.name AS name, COUNT(n) AS genre_cnt
    FROM artists a
    JOIN in_genre_helper h
    ON a.name = in_genre_helper.artist_name
    GROUP BY a.name
  )
  SELECT artist_name
  FROM same_decade sd
  JOIN same_genre sg
  ON sd.name = sg.name
  ORDER BY decade_cnt DESC, genre_cnt DESC
  LIMIT 5
  `;

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