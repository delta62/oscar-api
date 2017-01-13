exports.onMongo = function onMongo(req, res, err, cb) {
  if (err.code === 11000) {
    err.statusCode = 409;
    err.body = {
      code: 'ConflictError',
      message: err.message
    };
  }
  return cb();
};

exports.onBadRequest = function onBadRequest(req, res, err, cb) {
  err.statusCode = 400;
  err.body = {
    code: 'BadRequestError',
    message: err.message
  };
  return cb();
};

exports.onAfterFactory = function onAfterFactory(server) {
  console.log(this);
  return function onAfter(req, res, route, err) {
    let log = {
      status: res.statusCode,
      method: req.method,
      path: req.path()
    };

    if (err && err instanceof Error) {
      log.err = err;
    }
    server.log.info('after', log);
  };
};

exports.onUncaughtFactory = function onUncaughtFactory(server) {
  return function onUncauth(req, res, route, err) {
    server.log.error(err);
    res.send(500, { code: 'InternalServerError', message: err.message });
  };
};
