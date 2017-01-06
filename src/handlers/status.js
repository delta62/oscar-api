const pkg = require('../../package.json');

exports.get = function statusGetHandlerFactory(server) {
  return function statusGetHandler(req, res, next) {
    res.json({
      version: pkg.version,
      uptime: server.uptime()
    });
    next();
  };
};
