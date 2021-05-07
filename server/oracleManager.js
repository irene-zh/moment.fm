const oracledb = require('oracledb');
const connecCreds = require('./connectionCredentials.json');

const generateConnectionProps = () => {
  const connectString = `
  (DESCRIPTION=
    (ADDRESS=
      (PROTOCOL=TCP)
      (HOST=${connecCreds.hostname})
      (PORT=${connecCreds.port})
    )
    (CONNECT_DATA=
      (SID=${connecCreds.sid})
      )
    )`;

  return {
    user: connecCreds.username,
    password: connecCreds.password,
    connectString: connectString,
  };
};

const query = async (query, callback) => {
  let connection;
  let result;
  const connectionProps = generateConnectionProps();

  try {
    connection = await oracledb.getConnection(connectionProps);
    result = await connection.execute(query);
  } catch (err) {
    console.error(err);
    return -1;
  } finally {
    if (connection) {
      try {
        await connection.close();
        callback(result);
      } catch (err) {
        console.error(err);
        return -1;
      }
    }
  }
};

module.exports = {
  query: query,
};
