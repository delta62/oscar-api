const config                  = require('config');
const jwt                     = require('restify-jwt');
const restify                 = require('restify');
const { uptimePlugin }        = require('./uptime');
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
  uptimePlugin(server);

  return server;
};

exports.initHandlers = function initHandlers(server) {
  server.get('/status',         require('./handlers/status').get(server));
  server.get('/category',       require('./handlers/category').browse);
  server.patch('/category/:id', require('./handlers/category').patch);
  server.get('/response',       require('./handlers/response').browse);
  server.put('/response/:id',   require('./handlers/response').put);
  server.get('/user',           require('./handlers/user').get);
  server.post('/user',          require('./handlers/user').post);
  server.post('/login',         require('./handlers/login').post);
  server.get('/score',          require('./handlers/score').get);

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
