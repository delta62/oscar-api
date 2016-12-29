const jwt  = require('restify-jwt');
const mongoose = require('mongoose');
const restify  = require('restify');
const { reqConnFactory } = require('./middleware/conn');
const config   = require('config');

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
  server.use(jwt({ secret: 'secret' }).unless({ path: [
    { url: '/user', methods: [ 'POST' ] },
    '/status',
    '/login'
  ]}));

  return server;
};

exports.initEvents = function initEvents(server) {
  server.on('after', (req, res, route, err) => {
    let log = {
      status: res.statusCode,
      method: req.method,
      path: req.path()
    };

    if (err && err instanceof Error) {
      log.err = err;
    }
    server.log.info('after', log);
  });

  server.on('uncaughtException', (req, res, route, err) => {
    server.log.error(err);
    res.send(500, { code: 'InternalServerError', message: err.message });
  });

  server.on('Cast', (req, res, err, cb) => {
    err.statusCode = 400;
    err.body = {
      code: 'BadRequestError',
      message: err.message
    };
    return cb();
  });

  server.on('Validation', (req, res, err, cb) => {
    err.statusCode = 400;
    err.body = {
      code: 'BadRequestError',
      message: err.message
    };
    return cb();
  });

  server.on('Mongo', (req, res, err, cb) => {
    if (err.code === 11000) {
      err.statusCode = 409;
      err.body = {
        code: 'ConflictError',
        message: err.message
      };
    }
    return cb();
  });

  return server;
};
