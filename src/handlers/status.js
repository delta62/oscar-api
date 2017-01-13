const pkg        = require('../../package.json');
const { uptime } = require('../services/uptime');

exports.get = function statusGetHandler(req, res, next) {
  res.json({
    version: pkg.version,
    uptime: uptime(this.startedAt, +new Date())
  });
  next();
};
