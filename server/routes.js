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
    SELECT s.track_id AS id, s.name AS name, s.artist AS artist, EXTRACT(YEAR FROM s.release_date)
	FROM Songs s
	WHERE s.musical_mode = 0 AND s.duration_ms >= 120000 AND EXTRACT(YEAR FROM s.release_date) = 2020
	ORDER BY s.danceability ASC, s.energy ASC, s.loudness ASC
	FETCH NEXT 10 ROWS ONLY
  `;

  connection.query(query, (rows) => {
    res.json(rows);
  });
};

//get the 3 most popular songs from 2020 by the 3 most popular artists in 2019 
const getSongsPopular2020 = (req, res) => {
  const query = `
	WITH avg_popularity_2019 AS(
		SELECT a.name 
		FROM ARTISTS a
		JOIN SONGS s
		ON s.artist = a.name
		Where EXTRACT(year FROM s.release_date) = 2019
		GROUP BY a.name
		ORDER BY AVG(s.popularity) DESC
		OFFSET 0 ROWS FETCH NEXT 3 ROWS ONLY
	)
	SELECT s.name as name
	FROM SONGS s
	JOIN avg_popularity_2019 ap
	ON s.artist = ap.name
	WHERE EXTRACT(year FROM s.release_date) = 2020
	ORDER BY s.popularity DESC
	OFFSET 0 ROWS FETCH NEXT 3 ROWS ONLY
  `;

  connection.query(query, (rows) => {
    res.json(rows);
  });
}

// get the artists who released the most songs in 2019
const getArtistsFrequent2019 = (req, res) => {
  const query = `
    SELECT a.name AS name
	FROM SONGS s
	JOIN ARTISTS a
	ON s.artist = a.name
	WHERE EXTRACT(year FROM s.release_date) = 2019
	GROUP BY a.name
	ORDER BY COUNT(s.name) DESC
	OFFSET 0 ROWS FETCH NEXT 1 ROWS ONLY
  `;

  connection.query(query, (rows) => {
    res.json(rows);
  });
};

// get the top metal songs of 2005
const getMetal2005 = (req, res) => {
  const query = `
    SELECT s.name as name, s.artist as artist
	FROM Songs s
	WHERE EXTRACT(YEAR FROM s.release_date) = 2005
	ORDER BY s.liveness DESC
	FETCH FIRST 10 ROWS ONLY
  `;

  connection.query(query, (rows) => {
    res.json(rows);
  });
};

// get the most popular songs by the most popular hiphop artist of 2018
const getHipHop2018 = (req, res) => {
  const query = `
    WITH top_hiphop AS (
    SELECT DISTINCT a.name AS name, a.popularity as popularity
    FROM artists a 
    JOIN songs s
    ON s.artist = a.name
    WHERE a.genre LIKE '%hip hop%'
      GROUP BY a.name, a.popularity
    ORDER BY a.popularity DESC
    FETCH FIRST 1 ROWS ONLY
  )
  SELECT DISTINCT s.name as name, s.track_id AS id, s.artist AS artist, EXTRACT(year FROM s.release_date) AS year
  FROM songs s
  JOIN artists a
  ON s.artist = a.name
  WHERE s.artist IN 
  (SELECT name FROM top_hiphop)
  ORDER BY s.popularity DESC
  FETCH FIRST 5 ROWS ONLY
  `;

  connection.query(query, (rows) => {
    res.json(rows);
  });
};

// get songs most like I Got a Feeling by Black Eyed Peas
const getIGotAFeeling = (req, res) => {
  const query = `
  WITH got_a_feeling AS (
    SELECT s.energy, s.danceability, s.tempo, s.loudness
    FROM songs s
    WHERE LOWER(s.name) = LOWER('I gotta Feeling') AND s.artist = 'Black Eyed Peas'
      FETCH NEXT 1 ROWS ONLY
  )
  SELECT s.track_id AS id, s.name AS name, s.artist AS artist, EXTRACT(year FROM s.release_date) AS year, s.popularity
  FROM songs s, got_a_feeling g
  WHERE 
    ABS(s.tempo - g.tempo) < 10 AND
    ABS(s.danceability - g.danceability) < .1 AND
    ABS(s.energy - g.energy) < .1
  ORDER BY s.popularity
  FETCH NEXT 5 ROWS ONLY
  `;

  connection.query(query, (rows) => {
    res.json(rows);
  });
};

// get the most active artists in pop (number of songs / years active) 
const getArtistsActivePop = (req, res) => {
  const query = `
    WITH years_active AS (
    SELECT artist AS name, 
          MAX(EXTRACT(year FROM s.release_date)) - MIN(EXTRACT(year FROM s.release_date)) 
          AS num_years
    FROM SONGS s
    GROUP BY artist
  ), num_songs AS (
    SELECT a.name AS name, COUNT(s.name) AS num_songs
    FROM ARTISTS a
    JOIN SONGS s
    ON a.name = s.artist
  GROUP BY a.name 
  ), artist_activity AS (
  SELECT a.name AS name, n.num_songs / y.num_years AS activity
  FROM ARTISTS a
  JOIN years_active y
  ON a.name = y.name 
  JOIN num_songs n
  ON a.name = n.name
  WHERE y.num_years > 0
  )
  SELECT DISTINCT a.name
  FROM artist_activity a
  ORDER BY a.activity DESC
  FETCH NEXT 5 ROWS ONLY
  `;

  connection.query(query, (rows) => {
    res.json(rows);
  });
};

// get most relevant artists
// TODO...
const getArtistsRelevance = (req, res) => {
  const query = `
    
  `;

  connection.query(query, (rows) => {
    res.json(rows);
  });
};

module.exports = {
  getExample: getExample,
  getSaddest2020: getSaddest2020,
  getSongsPopular2020: getSongsPopular2020,
  getArtistsFrequent2019: getArtistsFrequent2019,
  getMetal2005: getMetal2005,
  getHipHop2018: getHipHop2018,
  getIGotAFeeling: getIGotAFeeling,
  getArtistsActivePop: getArtistsActivePop,
  getArtistsRelevance: getArtistsRelevance
};


/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */

/*
// get song info by id
const getSong = (req, res) => {
  const songId = req.params.songId;
  const query = `
  SELECT s.name, s.artist, s.id, s.album, s.year
  FROM songs s
  WHERE s.id = ${songId};
  `;

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });
};

// get arist info by id
const getArtist = (req, res) => {
  const artistId = req.params.artistId;
  const query = `
  SELECT a.name, a.id 
  FROM artists a
  WHERE a.id = ${artistId};
  `;

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });
};

// search for songs by title
const searchSongs = (req, res) => {
  const songTitle = req.params.song;
  const query = `
  SELECT s.name, s.artist, s.id, s.album, s.year
  FROM songs s
  WHERE s.title LIKE "%${songTitle}%";
  ORDER BY s.popularity DESC
  LIMIT 20;
  `;

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });
};

// search for artists by name
const searchArtists = (req, res) => {
  const artistName = req.params.name;
  const query = `
  SELECT a.name, a.id
  FROM artist a
  WHERE a.name LIKE "%${artistName}%";
  ORDER BY s.popularity DESC
  LIMIT 20;
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

// get password for input username and email
const getPassword = (req, res) => {
  const username = req.params.username;
  const email = req.params.email;
  const query = `
  SELECT u.password
  FROM users u
  WHERE u.username = ${username}
  AND u.email = ${email}
  `;

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });
};

// get friend's usernames
const getFriends = (req, res) => {
  const username = req.params.username;
  const query = `
  WITH user_email AS (
    SELECT u.email
    FROM users u
    WHERE u.username = ${username}
  )
  SELECT u.username AS friend
  FROM friends f
  JOIN users u
  ON f.friend_email = u.email
  WHERE f.user_email IN user_email
  `;

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });
};

const getUser = (req, res) => {
  const username = req.params.username;
  const query = `
  SELECT COUNT(u.username) AS cnt
  FROM users u
  WHERE u.username = ${username}
  `;

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });
};

const getEmail = (req, res) => {
  const email = req.params.email;
  const query = `
  SELECT COUNT(u.email) AS cnt
  FROM users u
  WHERE u.email = ${email}
  `;

  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  });
};

const addUser = (req, res) => {
  const username = req.params.username;
  const email = req.params.email;
  const password = req.params.password; 
  const name = req.params.name;

  const query = `
  INSERT INTO users(name, username, email, password) 
  (${name}, ${username}, ${email}, ${password})
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
