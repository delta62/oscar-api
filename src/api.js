const restify = require('restify');
const serverApi = require('./server');

exports.boot = function boot() {
  return Promise.resolve(restify.createServer())
    .then(serverApi.initLogging)
    .then(serverApi.initConnection)
    .then(serverApi.initMiddleware)
    .then(serverApi.initHandlers)
    .then(serverApi.initEvents);
};
