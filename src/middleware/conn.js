'use strict';

exports.reqConnFactory = function reqConnFactory(server) {
  return function requestConnection(req, res, next) {
    req.conn = server.conn;
    next();
  };
};
