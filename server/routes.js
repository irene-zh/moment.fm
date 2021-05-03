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

/* ---- Q1a (Dashboard) ---- */
// Equivalent to: function getTop20Keywords(req, res) {}
const getTop20Keywords = (req, res) => {
  const query = `
    SELECT DISTINCT kwd_name
    FROM movie_keyword
    GROUP BY kwd_name
    ORDER BY COUNT(kwd_name) DESC
    LIMIT 20;
  `;

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });
};


/* ---- Q1b (Dashboard) ---- */
const getTopMoviesWithKeyword = (req, res) => {
  var inputKwd = req.params.keyword;
  const query = `
    SELECT DISTINCT m.title, m.rating, m.num_ratings
    FROM movie m
    JOIN movie_keyword k
    ON m.movie_id = k.movie_id
    WHERE k.kwd_name = '${inputKwd}'
    ORDER BY m.rating DESC, m.num_ratings DESC
    LIMIT 10;
  `;

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });
};


/* ---- Q2 (Recommendations) ---- */
const getRecs = (req, res) => {
  var inputMovie = req.params.movie;
  const query = `
    WITH 
    all_cast AS (
      SELECT m.movie_id, m.title, c.cast_id
      FROM cast_in c
      JOIN movie m
      ON c.movie_id = m.movie_id
    ),
    input_cast AS (
      SELECT *
      FROM all_cast
      WHERE title = '${inputMovie}'
    ), 
    same_cast AS (
      SELECT a.movie_id, a.title, COUNT(a.cast_id) AS cnt
      FROM input_cast i
      INNER JOIN all_cast a
      ON i.cast_id = a.cast_id
      GROUP BY a.movie_id
    )
    SELECT m.title, m.movie_id, m.rating, m.num_ratings
    FROM same_cast s
    JOIN movie m
    ON s.movie_id = m.movie_id
    WHERE s.title != '${inputMovie}'
    ORDER BY s.cnt DESC, m.rating DESC, m.num_ratings DESC
    LIMIT 10;
  `;

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });
};


/* ---- Q3a (Best Movies) ---- */
const getDecades = (req, res) => {
  const query = `
    WITH 
    first_yr AS (
      SELECT release_year as year
      FROM movie
      ORDER BY release_year ASC
      LIMIT 1
    ),
    last_yr AS (
      SELECT release_year as year
      FROM movie
      ORDER BY release_year DESC
      LIMIT 1
    )
    SELECT year
    FROM first_yr
    UNION 
    SELECT year
    FROM last_yr
    ORDER BY year ASC;
  `;

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });
};


/* ---- (Best Movies) ---- */
const getGenres = (req, res) => {
  const query = `
    SELECT name
    FROM genre
    WHERE name <> 'genres'
    ORDER BY name ASC;
  `;

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });
};


/* ---- Q3b (Best Movies) ---- */
const bestMoviesPerDecadeGenre = (req, res) => {
  const decade = req.params.decade;
  const genre = req.params.genre;
  const query = `
    WITH 
    other_genres AS (
      SELECT m.movie_id, m.rating, g.genre_name
      FROM movie m
      JOIN movie_genre g
      ON m.movie_id = g.movie_id
      WHERE m.movie_id IN (
        SELECT DISTINCT m.movie_id
        FROM movie m
        JOIN movie_genre g
        ON m.movie_id = g.movie_id
        WHERE g.genre_name = '${genre}'
        AND m.release_year >= ${decade} 
        AND m.release_year < ${decade} + 10
      )
    ),
    other_movies AS (
      SELECT m.movie_id, m.rating, g.genre_name
      FROM movie m
      JOIN movie_genre g
      ON m.movie_id = g.movie_id
      WHERE g.genre_name IN (
        SELECT genre_name 
        FROM other_genres
      )
      AND m.release_year >= ${decade} 
      AND m.release_year < ${decade} + 10
    ),
    avg_other_genres AS (
      SELECT genre_name, AVG(rating) AS avg
      FROM other_movies
      GROUP BY genre_name
    ),
    compare_ratings AS (
      SELECT o.movie_id, o.rating, o.rating > a.avg AS bool
      FROM other_genres o
      JOIN avg_other_genres a
      ON a.genre_name = o.genre_name
    )
    SELECT m.title, m.movie_id, m.rating
    FROM compare_ratings c
    JOIN movie m
    ON c.movie_id = m.movie_id
    GROUP BY m.movie_id
    HAVING SUM(NOT(c.bool)) = 0
    ORDER BY m.title
    LIMIT 100;
  `;

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });
};

module.exports = {
	getArtist: getArtist,
	getTop20Keywords: getTop20Keywords,
	getTopMoviesWithKeyword: getTopMoviesWithKeyword,
	getRecs: getRecs,
  getDecades: getDecades,
  getGenres: getGenres,
  bestMoviesPerDecadeGenre: bestMoviesPerDecadeGenre
};