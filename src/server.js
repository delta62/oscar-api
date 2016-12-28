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
  server.post('/category',      require('./handlers/category').post);
  server.get('/user',           require('./handlers/user').get);
  server.post('/user',          require('./handlers/user').post);
  server.post('/login',         require('./handlers/login').post);

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
    server.log.info('after', {
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

  server.on('Cast', (req, res, err, cb) => {
    res.send(400, err.errors);
    return cb();
  })

  server.on('Validation', (req, res, err, cb) => {
    res.send(400, err.errors);
    return cb();
  });

  server.on('Mongo', (req, res, err, cb) => {
    if (err.code === 11000) {
      res.send(409, err);
    }
    cb();
  });

  return server;
};
