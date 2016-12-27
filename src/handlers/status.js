const pkg = require('../../package.json');

exports.get = function statusGetHandlerFactory(server) {
  return function statusGetHandler(req, res, next) {
    res.json({
      version: pkg.version,
      uptime: uptime(server.startedAt)
    });
    next();
  };
};

function uptime(started) {
  let now = +(new Date());
  return Math.floor((now - started) / 1000);
}
