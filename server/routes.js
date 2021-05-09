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

// saddest songs (lowest energy) of 2020
const getSaddest2020 = (req, res) => {
  const query = `
  SELECT DISTINCT s.track_id AS id, s.name AS name, s.artist AS artist, s.artist_id AS artist_id
	FROM Songs s
	WHERE s.musical_mode = 0 AND s.duration_ms >= 120000 AND EXTRACT(YEAR FROM s.release_date) = 2020
	ORDER BY s.danceability ASC, s.energy ASC, s.loudness ASC, s.popularity DESC
	FETCH NEXT 5 ROWS ONLY
  `;

  connection.query(query, (rows) => {
    res.json(rows);
  });
};

// get song info by id
const getSong = (req, res) => {
  const songId = req.params.id;
  const query = `
  SELECT DISTINCT s.name, s.artist, s.artist_id, s.track_id AS id, EXTRACT(YEAR FROM s.release_date) AS year
  FROM songs s
  WHERE s.track_id = '${songId}'
  `;

  connection.query(query, (rows) => {
    res.json(rows);
  });
};

// get arist info by id
const getArtist = (req, res) => {
  const artistId = req.params.id;
  const query = `
  SELECT DISTINCT a.name AS name, a.artist_id AS id
  FROM Artists a
  WHERE a.artist_id ='${artistId}'
  `;

  connection.query(query, (rows) => {
    res.json(rows);
  });
};

// get top songs by input artist
const getTopSongsByArtist = (req, res) => {
  const artistId = req.params.id;
  const query = `
  SELECT DISTINCT s.name, s.artist, s.track_id AS id, EXTRACT(YEAR FROM s.release_date) AS year, s.artist_id
  FROM Songs s
  WHERE s.artist_id ='${artistId}'
  ORDER BY s.popularity DESC
  FETCH NEXT 10 ROWS ONLY
  `;

  connection.query(query, (rows) => {
    res.json(rows);
  });
};

// search for songs by title
const searchSongs = (req, res) => {
  const songName = req.params.name;
  const query = `
  SELECT DISTINCT s.name, s.artist, s.track_id AS id, EXTRACT(YEAR FROM s.release_date) AS year, s.artist_id
  FROM songs s
  WHERE LOWER(s.name) LIKE LOWER('%${songName}%')
  ORDER BY s.popularity DESC
  FETCH FIRST 20 ROWS ONLY
  `;

  connection.query(query, (rows) => {
    res.json(rows);
  });
};

// search for artists by name
const searchArtists = (req, res) => {
  const artistName = req.params.name;
  const query = `
  SELECT DISTINCT a.name AS name, a.artist_id AS id
  FROM artists a
  WHERE LOWER(a.name) LIKE LOWER('%${artistName}%')
  ORDER BY a.popularity DESC
  FETCH FIRST 20 ROWS ONLY
  `;

  connection.query(query, (rows) => {
    res.json(rows);
  });
};

// get recommended artists for an input artist
const getRecommendedArtists = (req, res) => {
  const artistId = req.params.id;
  const query = `
  WITH convert_to_decade AS (
    SELECT s.track_id, s.name, s.artist, s.artist_id, EXTRACT(year FROM s.release_date) - MOD(EXTRACT(year FROM s.release_date), 10) as decade
    FROM songs s
  ),
  most_active_decade AS (
    SELECT c.decade AS decade
    FROM convert_to_decade c
      WHERE c.artist_id = '${artistId}'
    GROUP BY c.decade
    ORDER BY COUNT(*) DESC
    FETCH NEXT 1 ROWS ONLY
  ),
  this_genre AS (
      SELECT a.genre AS genre
      FROM artists a
      WHERE a.artist_id = '${artistId}'
    FETCH NEXT 1 ROWS ONLY
  ), 
  same_genre AS (
      SELECT DISTINCT a.name AS name, a.artist_id AS artist_id, a.popularity AS popularity 
      FROM artists a, this_genre t
      WHERE a.genre IN t.genre
  ),
  same_decade AS (
    SELECT DISTINCT a.artist_id AS artist_id, COUNT(s.name) AS decade_cnt
      FROM most_active_decade m, same_genre g, artists a
    JOIN songs s
    ON a.artist_id = s.artist_id
    WHERE EXTRACT(year FROM s.release_date) >= m.decade
    AND EXTRACT(year FROM s.release_date) <= m.decade + 9
      AND a.artist_id IN g.artist_id
    GROUP BY a.artist_id
  )
  SELECT a.name, sd.artist_id, sd.decade_cnt, sg.popularity
  FROM same_decade sd
  JOIN artists a
  ON a.artist_id = sd.artist_id
  JOIN same_genre sg
  ON sg.artist_id = sd.artist_id
  WHERE a.artist_id <> '${artistId}'
  ORDER BY decade_cnt DESC, sg.popularity DESC
  FETCH NEXT 5 ROWS ONLY
  `;

  connection.query(query, (rows) => {
    res.json(rows);
  });
};

// get songs most like I Gotta Feeling by Black Eyed Peas
const getIGotAFeeling = (req, res) => {
  const query = `
  WITH got_a_feeling AS (
    SELECT s.energy, s.danceability, s.tempo, s.loudness
    FROM songs s
    WHERE LOWER(s.name) = LOWER('I gotta Feeling') AND s.artist = 'Black Eyed Peas'
    FETCH NEXT 1 ROWS ONLY
  )
  SELECT DISTINCT s.track_id AS id, s.name AS name, s.artist AS artist, EXTRACT(year FROM s.release_date) AS year, s.track_id, s.popularity
  FROM songs s, got_a_feeling g
  WHERE 
    ABS(s.tempo - g.tempo) < 10 AND
    ABS(s.danceability - g.danceability) < .1 AND
    ABS(s.energy - g.energy) < .1
  ORDER BY s.popularity DESC
  FETCH NEXT 5 ROWS ONLY
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
  SELECT DISTINCT s.name as name, s.track_id AS id, s.artist AS artist, EXTRACT(year FROM s.release_date) AS year, s.artist_id
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

// get the top metal songs of 2005
const getMetal2005 = (req, res) => {
  const query = `
  SELECT DISTINCT s.name as name, s.track_id AS id, s.artist as artist, EXTRACT(year FROM s.release_date) AS year, s.artist_id
  FROM Songs s
  JOIN Artists a
  ON s.artist_id = a.artist_id
  WHERE EXTRACT(year FROM s.release_date) = 2005
  AND a.genre LIKE '%metal'
  ORDER BY s.liveness DESC, s.popularity DESC
  FETCH FIRST 5 ROWS ONLY
  `;

  connection.query(query, (rows) => {
    res.json(rows);
  });
};

// get the most popular songs of 2020 by the most popular artists of 2019
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
    FETCH NEXT 3 ROWS ONLY
  )
  SELECT DISTINCT s.name as name, s.track_id AS id, s.artist AS artist, EXTRACT(year FROM s.release_date) AS year, s.artist_id
  FROM SONGS s
  JOIN avg_popularity_2019 ap
  ON s.artist = ap.name
  WHERE EXTRACT(year FROM s.release_date) = 2020
  ORDER BY s.popularity DESC
  FETCH NEXT 5 ROWS ONLY
  `;

  connection.query(query, (rows) => {
    res.json(rows);
  });
};

// get the artists who released the most songs in 2019
const getArtistsFrequent2019 = (req, res) => {
  const query = `
  SELECT DISTINCT a.name AS name, a.artist_id AS id
  FROM SONGS s
  JOIN ARTISTS a
  ON s.artist_id = a.artist_id
  WHERE EXTRACT(year FROM s.release_date) = 2019
  GROUP BY a.artist_id, a.name
  ORDER BY COUNT(s.name) DESC
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
    SELECT artist_id AS artist_id, 
          MAX(EXTRACT(year FROM s.release_date)) - MIN(EXTRACT(year FROM s.release_date)) 
          AS num_years
    FROM SONGS s
    GROUP BY s.artist_id
  ), num_songs AS (
    SELECT a.artist_id, COUNT(s.name) AS num_songs
    FROM ARTISTS a
    JOIN SONGS s
    ON a.name = s.artist
    GROUP BY a.artist_id 
  ), 
  artist_activity AS (
  SELECT a.artist_id AS artist_id, n.num_songs / y.num_years AS activity
  FROM ARTISTS a
  JOIN years_active y
  ON a.artist_id = y.artist_id
  JOIN num_songs n
  ON a.artist_id = n.artist_id
  WHERE y.num_years > 0
  )
  SELECT DISTINCT b.name, a.artist_id
  FROM artist_activity a
  JOIN artists b
  ON a.artist_id = b.artist_id
  ORDER BY a.activity DESC
  FETCH NEXT 5 ROWS ONLY
  `;

  connection.query(query, (rows) => {
    res.json(rows);
  });
};

// get most relevant artists
const getArtistsRelevance = (req, res) => {
  const query = `
  WITH top_artists AS(
    SELECT DISTINCT name
    FROM ARTISTS 
    ORDER BY popularity DESC
    OFFSET 0 ROWS FETCH NEXT 100 ROWS ONLY
  ),
  most_pop_1 AS(
    SELECT s.artist, s.artist_id, s.popularity
    FROM SONGS s 
    JOIN top_artists t 
    ON t.name = s.artist
    WHERE (EXTRACT(year FROM s.release_date)) > 2005 AND (EXTRACT(year FROM s.release_date)) < 2015
    ORDER BY s.popularity DESC
    FETCH NEXT 2000 ROWS ONLY
  ),
  num_hits_1 AS (
    SELECT artist_id, COUNT(*) as num_hits
    FROM most_pop_1
    GROUP BY artist_id
  ),
  most_pop_2 AS(
    SELECT s.artist, s.artist_id, s.popularity
    FROM SONGS s 
    JOIN top_artists t 
    ON t.name = s.artist
    WHERE (EXTRACT(year FROM s.release_date)) > 2014 AND (EXTRACT(year FROM s.release_date)) < 2021 
    ORDER BY s.popularity DESC
    FETCH NEXT 2000 ROWS ONLY
  ),
  num_hits_2 AS (
    SELECT artist_id, COUNT(*) as num_hits
    FROM most_pop_2
    GROUP BY artist_id
  )
  SELECT DISTINCT c.name, a.artist_id, (b.num_hits * a.num_hits) as relevance
  FROM num_hits_1 a 
  JOIN num_hits_2 b 
  ON a.artist_id = b.artist_id
  JOIN artists c
  ON c.artist_id = a.artist_id
  ORDER BY relevance DESC
  FETCH NEXT 10 ROWS ONLY
  `;

  connection.query(query, (rows) => {
    res.json(rows);
  });
};

// get password for input username and email
const getPassword = (req, res) => {
  const username = req.params.username;
  const email = req.params.email;
  const query = `
  SELECT u.password
  FROM users u
  WHERE u.username = '${username}'
  AND u.email = '${email}'
  `;

  connection.query(query, (rows) => {
    res.json(rows);
  });
};

// get friend's usernames
const getFriends = (req, res) => {
  const username = req.params.username;
  const query = `
  WITH user_email AS (
    SELECT u.email
    FROM users u
    WHERE u.username = '${username}'
  ), 
  friend_1 AS (
  SELECT DISTINCT u.username AS friend
  FROM user_email e, friends f
  JOIN users u
  ON u.email = f.friend_email
  WHERE f.user_email IN e.email
  AND u.username <> '${username}'
  ),
  friend_2 AS (
  SELECT DISTINCT u.username AS friend
  FROM user_email e, friends f
  JOIN users u
  ON u.email = f.user_email
  WHERE f.friend_email IN e.email
  AND u.username <> '${username}'
  )
  SELECT DISTINCT friend
  FROM friend_1
  UNION SELECT * FROM friend_2
  `;

  connection.query(query, (rows) => {
    res.json(rows);
  });
};

// get number of users with this username (checks username validity)
const getUser = (req, res) => {
  const username = req.params.username;
  const query = `
  SELECT COUNT(u.username) AS cnt
  FROM users u
  WHERE u.username = '${username}'
  `;

  connection.query(query, (rows) => {
    res.json(rows);
  });
};

// get number of users with this email (checks email validity)
const getEmail = (req, res) => {
  const email = req.params.email;
  const query = `
  SELECT COUNT(u.email) AS cnt
  FROM users u
  WHERE u.email = '${email}'
  `;

  connection.query(query, (rows) => {
    res.json(rows);
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

  connection.query(query, (rows) => {
    res.json(rows);
  });
  connection.query('COMMIT', (rows) => {
    if (err) console.log(err);
  });
};

module.exports = {
  getExample: getExample,
  getSong: getSong,
	getArtist: getArtist,
  getTopSongsByArtist: getTopSongsByArtist,
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
