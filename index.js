'use strict';

const api = require('./src/api');

api.boot()
  .then(server => server.listen(8080, err => {
    server.log.info(`${server.name} listening on ${server.url}`);
  }))
  .catch(err => console.error(err));
