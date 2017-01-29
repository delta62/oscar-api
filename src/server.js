const config                  = require('config');
const jwt                     = require('restify-jwt');
const restify                 = require('restify');
const { modelCache }          = require('./middleware/model-cache');
const { dbConnectionFactory } = require('./connection-factory');
const socketio = require('socket.io');
const {
  onMongo,
  onBadRequest,
  onAfterFactory,
  onUncaughtFactory
} = require('./events');

exports.initConnection = function initConnection(server) {
  return dbConnectionFactory().then(conn => modelCache(server, conn));
};

exports.initSockets = function initSockets(server) {
  let io = socketio(server);
  console.log(io.sockets);
  console.log('socket is listening');
  server.socketConnections = [ ];
  io.sockets.on('connection', socket => {
    console.log('client connected', socket);
    server.socketConnections.push(socket);

    socket.on('disconnect', () => {
      console.log('client disconnected', socket);
      let idx = server.socketConnections.indexOf(socket);
      if (idx !== -1) {
        server.socketConnections.splice(idx, 1);
      }
    });
  });

  return server;
};

exports.initLogging = function initLogging(server) {
  server.log.level(config.get('log.level'));
  server.startedAt = +new Date();

  return server;
};

exports.initMiddleware = function initMiddleware(server) {
  server.use(restify.bodyParser({ mapParams: false }));
  server.use(restify.CORS({ origins: config.get('cors.origins') }));
  restify.CORS.ALLOW_HEADERS.push('authorization');
  server.use(jwt({ secret: config.get('auth.secret') }).unless({ path: [
    { url: '/user', methods: 'POST' },
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
