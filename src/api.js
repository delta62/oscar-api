const restify = require('restify');
const { initRoutes } = require('./router');
const {
  initLogging,
  initConnection,
  initMiddleware,
  initSockets,
  initEvents
} = require('./server');
require('promise-do');

exports.boot = function boot() {
  let opts = { name: 'oscar-api' };
  return Promise.resolve(restify.createServer(opts))
    .then(initLogging)
    .then(initConnection)
    .then(initMiddleware)
    .then(initRoutes)
    .then(initSockets)
    .then(initEvents);
};
