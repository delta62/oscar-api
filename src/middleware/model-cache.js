const { userModelFactory }     = require('../model/user');
const { categoryModelFactory } = require('../model/category');
const { responseModelFactory } = require('../model/response');
const { pinModelFactory }      = require('../model/pin');

exports.modelCache = function modelCache(server, conn) {
  let User, Category, Response, Pin;

  server.models = {
    get User() {
      if (!User) {
        User = userModelFactory(conn);
      }
      return User;
    },

    get Category() {
      if (!Category) {
        Category = categoryModelFactory(conn);
      }
      return Category;
    },

    get Response() {
      if (!Response) {
        Response = responseModelFactory(conn);
      }
      return Response;
    },

    get Pin() {
      if (!Pin) {
        Pin = pinModelFactory(conn);
      }
      return Pin;
    }
  };

  return server;
};
