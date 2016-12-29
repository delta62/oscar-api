const jwt  = require('restify-jwt'),
  mongoose = require('mongoose'),
  restify  = require('restify'),
  { reqConnFactory } = require('./middleware/conn'),
  config   = require('config');

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
    res.send(500, { code: 'InternalServer', message: err.message });
  });

  server.on('Cast', (req, res, err, cb) => {
    err.code = 'BadRequest';
    err.statusCode = 400;
    return cb();
  })

  server.on('Validation', (req, res, err, cb) => {
    err.code = 'BadRequest';
    err.statusCode = 400;
    return cb();
  });

  server.on('Mongo', (req, res, err, cb) => {
    if (err.code === 11000) {
      err.code = 'Conflict';
      err.statusCode = 409;
    }
    return cb();
  });

  return server;
};
