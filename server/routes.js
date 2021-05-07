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
