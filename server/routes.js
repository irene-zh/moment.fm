const connection = require('./oracleManager');

// Example function to show how to query OracleDB instance
// Everything is the same except instead of (err, rows, fields) in
// connection.query, it's just (rows)
const example = (req, res) => {
  const query = `
    SELECT COUNT(*)
    FROM dbname.tablename
  `;

  connection.query(query, (rows) => {
    res.json(rows);
  });
};

module.exports = {
  example: example,
};
