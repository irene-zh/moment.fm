const connection = require('./oracleManager');

// Example function to show how to query OracleDB instance
// Everything is the same except instead of (err, rows, fields) in
// connection.query, it's just (rows)
const getExample = (req, res) => {
  const query = `
    SELECT COUNT(*) AS CNT
    FROM Songs
  `;

  connection.query(query, (rows) => {
    res.json(rows);
  });
};

//saddest songs (lowest energy) of 2020
const getSaddest2020 = (req, res) => {
  const query = `
    SELECT s.track_id AS id, s.name AS name, s.artist AS artist
	FROM Songs s
	WHERE s.musical_mode = 0 AND s.duration_ms >= 120000 AND EXTRACT(YEAR FROM s.release_date) = 2020
	ORDER BY s.danceability ASC, s.energy ASC, s.loudness ASC
	FETCH NEXT 10 ROWS ONLY
  `;

  connection.query(query, (rows) => {
    res.json(rows);
  });
};

module.exports = {
  getExample: getExample,
  getSaddest2020: getSaddest2020,
};


/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */

/*
// get song info by id: EDITED
const getSong = (req, res) => {
  const songId = req.params.songId;
  const query = `
  SELECT s.name, s.artist, s.track_id AS id, EXTRACT(YEAR FROM s.release_date) AS year
  FROM songs s
  WHERE s.track_id = '${songId}'
  `;

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });
};

// get arist info by id: EDITED
const getArtist = (req, res) => {
  const artistId = req.params.artistId;
  const query = `
  SELECT a.name AS name, a.artist_id AS id
  FROM Artists a
  WHERE a.artist_id ='${artistId}'
  `;

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });
};

// search for songs by title: EDITED
const searchSongs = (req, res) => {
  const songTitle = req.params.song;
  const query = `
  SELECT s.name, s.artist, s.track_id AS id, EXTRACT(YEAR FROM s.release_date) AS year
  FROM songs s
  WHERE s.name LIKE '${songId}'
  ORDER BY s.popularity DESC
  FETCH FIRST 20 ROWS ONLY
  `;

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });
};

// search for artists by name: EDITED
const searchArtists = (req, res) => {
  const artistName = req.params.name;
  const query = `
  SELECT a.name AS name, a.artist_id AS id
  FROM artists a
  WHERE a.name LIKE '%${artistName}%'
  ORDER BY a.popularity DESC
  FETCH FIRST 20 ROWS ONLY
  `;

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });
};

// get recommended artists for an input artist
const getRecommendedArtists = (req, res) => {
  const artistName = req.params.name;
  const query = `
  WITH convert_to_decade AS (
    SELECT s.year - (s.year % 10) as decade
    FROM song s
  ),
  most_active AS (
    SELECT s.decade
    FROM artists a
    JOIN song s
    ON s.artist_name = a.name
    WHERE a.name = ${artistName}
    GROUP BY s.decade
    ORDER BY COUNT(s.decade) DESC
    LIMIT 1
  ),
  top_genres AS (
    SELECT s.genre
    FROM artist a
    JOIN song s 
    ON a.name = s.artist_name
  WHERE a.name = ${artistName}
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
  LIMIT 5;
  `;

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });
};

// get songs most like I Got a Feeling by Black Eyed Peas
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
  LIMIT 5;
  `;

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });
};

// get the most popular songs by the most popular hiphop artist of 2018
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

// get the top metal songs of 2005
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

// get the most popular songs of 2020 by the most popular artists of 2019
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

// get the artists who released the most songs in 2019
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

// get the most active artists in pop (number of songs / years active) 
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
  LIMIT 10;
  `;

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });
};

// get most relevant artists
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
  FROM num_hits_1 a JOIN num_hits_2 b ON a.artist = b.artist; 
  `;

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });
};

// get password for input username and email: EDITED
const getPassword = (req, res) => {
  const username = req.params.username;
  const email = req.params.email;
  const query = `
  SELECT u.password
  FROM users u
  WHERE u.username = '${username}'
  AND u.email = '${email}'
  `;

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });
};

// get friend's usernames: EDITED
const getFriends = (req, res) => {
  const username = req.params.username;
  const query = `
  WITH user_email AS (
    SELECT u.email
    FROM users u
    WHERE u.username = '${username}'
  )
  SELECT DISTINCT u.username AS friend
  FROM friends f
  JOIN users u
  ON u.email = f.friend_email
  WHERE f.user_email = user_email
  AND u.username <> '${username}'
  `;

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });
};

// get number of users with this username (checks username validity): EDITED
const getUser = (req, res) => {
  const username = req.params.username;
  const query = `
  SELECT COUNT(u.username) AS cnt
  FROM users u
  WHERE u.username = '${username}'
  `;

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });
};

// get number of users with this email (checks email validity): EDITED
const getEmail = (req, res) => {
  const email = req.params.email;
  const query = `
  SELECT COUNT(u.email) AS cnt
  FROM users u
  WHERE u.email = '${email}'
  `;

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });
};

// add new user: EDITED
const addUser = (req, res) => {
  const username = req.params.username;
  const email = req.params.email;
  const password = req.params.password; 
  const name = req.params.name;

  const query = `
  INSERT INTO users(name, username, email, password) values
  ('${name}', '${username}', '${email}', '${password}')
  `;

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
  });
};


module.exports = {
  getSong: getSong,
	getArtist: getArtist,
	getRecommendedArtists: getRecommendedArtists,
  searchSongs: searchSongs,
  searchArtists: searchArtists,
  getIGotAFeeling: getIGotAFeeling,
  getSaddest2020: getSaddest2020,
  getHipHop2018: getHipHop2018,
  getMetal2005: getMetal2005,
  getSongsPopular2020: getSongsPopular2020,
  getArtistsFrequent2019: getArtistsFrequent2019,
  getArtistsActivePop: getArtistsActivePop,
  getArtistsRelevance: getArtistsRelevance, 
  getPassword: getPassword,
  getFriends: getFriends, 
  getUser: getUser,
  getEmail: getEmail, 
  addUser: addUser
};
*/
