const config = require('config');
const jwt = require('restify-jwt');
const mongoose = require('mongoose');
const restify = require('restify');
const { reqConnFactory } = require('./middleware/conn');
const {
  onMongo,
  onBadRequest,
  onAfterFactory,
  onUncaughtFactory
} = require('./events');

exports.initConnection = function initConnection(server) {
  mongoose.Promise = Promise;
  let host = config.get('db.host'),
    port = config.get('db.port'),
    db = config.get('db.db');

  return new Promise((resolve, reject) => {
    let conn = mongoose.createConnection(`mongodb://${host}:${port}/${db}`);
    server.conn = conn;
    conn.once('connected', () => resolve(server));
    conn.once('error', err => reject(err));
  });
};

exports.initLogging = function initLogging(server) {
  server.log.level(config.get('log.level'));
  server.startedAt = +(new Date());

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
  server.use(reqConnFactory(server));
  server.use(restify.bodyParser({ mapParams: false }));
  server.use(jwt({ secret: config.get('auth.secret') }).unless({ path: [
    { url: '/user', methods: [ 'POST' ] },
    '/status',
    '/login'
  ]}));

  return server;
};

exports.initEvents = function initEvents(server) {
  server.on('after', onAfterFactory(server));
  server.on('uncaughtException', onUncaughtFactory(server));
  server.on('Cast', onBadRequest);
  server.on('Validation', onBadRequest);
  server.on('Mongo', onMongo);

  return server;
};
