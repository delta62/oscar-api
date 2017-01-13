const config                  = require('config');
const jwt                     = require('restify-jwt');
const restify                 = require('restify');
const { modelCache }          = require('./middleware/model-cache');
const { dbConnectionFactory } = require('./connection-factory');
const {
  onMongo,
  onBadRequest,
  onAfterFactory,
  onUncaughtFactory
} = require('./events');

exports.initConnection = function initConnection(server) {
  return dbConnectionFactory().then(conn => modelCache(server, conn));
};

exports.initLogging = function initLogging(server) {
  server.log.level(config.get('log.level'));
  server.startedAt = +new Date();

  return server;
};

exports.initMiddleware = function initMiddleware(server) {
  server.use(restify.bodyParser({ mapParams: false }));
  server.use(jwt({ secret: config.get('auth.secret') }).unless({ path: [
    { url: '/user', methods: [ 'POST' ] },
    '/status',
    '/login'
  ]}));

  return server;
};

exports.initEvents = function initEvents(server) {
  server.on('after',             onAfterFactory(server));
  server.on('uncaughtException', onUncaughtFactory(server));
  server.on('Cast',              onBadRequest);
  server.on('Validation',        onBadRequest);
  server.on('Mongo',             onMongo);

  return server;
};
