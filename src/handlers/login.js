const { ensureFound }       = require('../util');
const { UnauthorizedError } = require('restify');
const { loginValidator }    = require('../validators/login');
const { pinPostValidator }  = require('../validators/pin');
const { signToken }         = require('../services/login');
const { generatePin }       = require('../services/pin');
const { sendMail }          = require('../services/mail');

function loginHandler(req, res, next) {
  loginValidator(req)
    .then(model => this.models.User.findOne({ email: model.email }))
    .do(user => {
      if (user) {
        const pin = generatePin(user);
        let doc = { username: user.email, pin };
        this.models.Pin.remove({ username: user.email })
          .then(() => this.models.Pin.create(doc))
          .then(() => sendMail(user, pin));
      }
    })
    .then(() => res.send(200))
    .then(next)
    .catch(next);
}

function pinHandler(req, res, next) {
  let email;

  pinPostValidator(req)
    .then(model => {
      email = model.username;
      let query = {
        username: model.username,
        pin: model.pin,
        expires: { $gte: Date.now() }
      };
      return this.models.Pin.findOne(query);
    })
    .do(pin => ensureFound(pin, new UnauthorizedError()))
    .then(() => this.models.User.findOne({ email }).then(signToken))
    .then(token => res.json({ token }))
    .then(next)
    .catch(next);
}

module.exports = {
  loginHandler: loginHandler,
  pinHandler: pinHandler
};
