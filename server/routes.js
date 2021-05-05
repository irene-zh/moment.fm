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
    FROM songs s
    WHERE s.name = "I got a Feeling" 
    AND s.artist_name = "Black Eyed Peas"
  )
  SELECT s.id AS id, s.name AS name, s.artist AS artist, s.year AS year
  FROM songs s, got_a_feeling
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

const getSaddest2020 = (req, res) => {
  const query = `
  SELECT s.id AS id, s.name AS name, s.artist AS artist, s.year AS year
  FROM songs s
  WHERE s.mode = 0
  ORDER BY 
  s.danceability ASC,
  s.energy ASC,
  s.loudness ASC
  LIMIT 10;
  `;

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });
};

const getHipHop2018 = (req, res) => {
  const query = `
  WITH top_hiphop AS (
    SELECT a.name AS name
    FROM artists a 
    JOIN songs s
    ON s.artist_name = a.name
    WHERE s.genre LIKE “%hip hop%”
    GROUP BY a.name
    ORDER BY a.popularity DESC
    LIMIT 1
  )
  SELECT a.name AS artst_name, s.id AS id, s.name AS name, s.year AS year
  FROM songs s
  JOIN artists a
  ON s.artist_name = a.name
  WHERE s.artist IN top_hiphop.name
  ORDER BY s.popularity DESC
  LIMIT 5;
  `;

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });
};

const getMetal2005 = (req, res) => {
  const query = `
  SELECT s.id as id, s.name AS name, s.artist AS artist, s.year AS year
  FROM songs s
  ORDER BY s.liveness DESC
  LIMIT 10;
  `;

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });
};

const getSongsPopular2020 = (req, res) => {
  const query = `
  WITH avg_popularity_2019 AS(
    SELECT a.name 
    FROM artists a
    JOIN songs s
    ON s.artist_name = a.name
    Where s.year = 2019
    GROUP BY a.name
    ORDER BY AVG(s.popularity) DESC
    LIMIT 3
  )
  SELECT s.id as id, s.name AS name, s.artist AS artist, s.year AS year
  FROM songs s
  JOIN artists a
  ON s.artist_name = a.name
  WHERE (s.year = 2020 
  AND a.name 
  IN avg_popularity_2019)
  ORDER BY s.popularity DESC
  LIMIT 3;
  `;

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });
};

const getArtistsFrequent2019 = (req, res) => {
  const query = `
  SELECT artist.name AS name
  FROM songs s
  JOIN artists a
  ON s.artist_name = a.name
  WHERE s.year = 2019
  GROUP BY a.name
  ORDER BY COUNT(s.id) DESC
  LIMIT 5;
  `;

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });
};

const getArtistsActivePop = (req, res) => {
  const query = `
  WITH years_active AS (
    SELECT artist AS name, MAX(year) - MIN(year) AS num_years
    FROM songss
    GROUP BY artist
  ), num_songs AS (
    SELECT a.name AS name, COUNT(s.name) AS num_songs
    FROM artists a
    JOIN songs s
    ON a.name = s.artist_name
  GROUP BY a.name 
  ), artist_activity AS (
  SELECT a.name AS name, n.num_songs / y.num_years AS activity
  FROM artists a
  JOIN years_active y
  ON a.name = y.name 
  JOIN num_songs n
  ON a.name = n.name
  )
  SELECT a.name
  FROM artist_activity a
  ORDER BY a.activity DESC
  LIMIT 10
  `;

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });
};

const getArtistsRelevance = (req, res) => {
  const query = `
  WITH top_artists AS(
    SELECT artist_name
    FROM artists 
    ORDER BY popularity
    LIMIT 100
  ),
  most_pop_1 AS(
    SELECT artist, popularity
    FROM songs s 
    ORDER BY s.popularity DESC
    WHERE year > 1999 AND year < 2005 
  ),
  Num_hits_1 AS (
    SELECT artist, COUNT(*) as num_hits
    FROM most_pop_1
    GROUP BY artist
  ),
  most_pop_2 AS(
  SELECT artist
    FROM songs s
    ORDER BY s.popularity DESC
    WHERE year > 2004 AND year < 2005 
  ),
  Num_hits_2 AS (
    SELECT artist, COUNT(*) as num_hits
    FROM most_pop_2
    GROUP BY artist
  )
  SELECT a.artist, (num_hits_1*num_hits_2)
  FROM num_hits_1 a JOIN num_hits_2 b ON a.artist = b.artist  
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
  getIGotAFeeling: getIGotAFeeling,
  getSaddest2020: getSaddest2020,
  getHipHop2018: getHipHop2018,
  getMetal2005: getMetal2005,
  getSongsPopular2020: getSongsPopular2020,
  getArtistsFrequent2019: getArtistsFrequent2019,
  getArtistsActivePop: getArtistsActivePop,
  getArtistsRelevance: getArtistsRelevance
};