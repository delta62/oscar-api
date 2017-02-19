const { statusGetHandler } = require('./handlers/status');
const {
  categoryBrowseHandler,
  categoryPatchHandler
} = require('./handlers/category');
const {
  responseBrowseHandler,
  responsePutHandler
} = require('./handlers/response');
const {
  userBrowseHandler,
  userPostHandler
} = require('./handlers/user');
const {
  loginHandler,
  pinHandler
} = require('./handlers/login');
const {
  scoreGetHandler,
  scoreBrowseHandler
} = require('./handlers/score');

exports.initRoutes = function initRoutes(server) {
  server.get('/status',         statusGetHandler);
  server.get('/category',       categoryBrowseHandler);
  server.patch('/category/:id', categoryPatchHandler);
  server.get('/response',       responseBrowseHandler);
  server.put('/response/:id',   responsePutHandler);
  server.get('/user',           userBrowseHandler);
  server.post('/user',          userPostHandler);
  server.post('/login',         loginHandler);
  server.post('/pin',           pinHandler);
  server.get('/score/:id',      scoreGetHandler);
  server.get('/score',          scoreBrowseHandler);

  return server;
};
