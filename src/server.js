'use strict';

const jwt  = require('restify-jwt'),
  mongoose = require('mongoose'),
  restify  = require('restify');

exports.initConnection = function initConnection(server) {
  mongoose.Promise = Promise;
  return mongoose
    .connect('mongodb://localhost:27017/oscars')
    .then(() => server);
};

exports.initLogging = function initLogging(server) {
  server.log.level('INFO');
  server.startedAt = +(new Date());

  return server;
};

exports.initHandlers = function initHandlers(server) {
  server.get('/status',   require('./handlers/status').get(server));
  server.get('/category', require('./handlers/category').browse);
  server.post('/user',    require('./handlers/user').post);
  server.post('/login',   require('./handlers/login').post);

  return server;
};

exports.initMiddleware = function initMiddleware(server) {
  server.use(restify.bodyParser({ mapParams: false }));
  server.use(jwt({ secret: 'secret' }).unless({ path: [
    '/user',
    '/status',
    '/login'
  ]}));

  return server;
};

exports.initEvents = function initEvents(server) {
  server.on('after', (req, res, route, err) => {
    server.log.info({
      status: res.statusCode,
      method: req.method,
      path: req.path(),
      err
    });
  });

  server.on('uncaughtException', (req, res, route, err) => {
    server.log.error(err);
    res.send(500, { message: err.message });
  });

  return server;
};
