const mongoose = require('mongoose');
const config = require('config');

exports.dbConnectionFactory = function dbConnectionFactory() {
  mongoose.Promise = Promise;
  let host = config.get('db.host'),
    port = config.get('db.port'),
    db = config.get('db.db');

  return new Promise((resolve, reject) => {
    let conn = mongoose.createConnection(`mongodb://${host}:${port}/${db}`);
    conn.once('connected', () => resolve(conn));
    conn.once('error', err => reject(err));
  });
};
