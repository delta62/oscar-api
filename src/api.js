const restify = require('restify');
const serverApi = require('./server');
require('promise-do');

exports.boot = function boot() {
  let opts = { name: 'oscar-api' };
  return Promise.resolve(restify.createServer(opts))
    .then(serverApi.initLogging)
    .then(serverApi.initConnection)
    .then(serverApi.initMiddleware)
    .then(serverApi.initHandlers)
    .then(serverApi.initEvents);
};
