const { randomBytes } = require('crypto');

const PIN_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';

exports.generatePin = function generatePin(len) {
  const bytes = randomBytes(len);
  let ret = new Array(len);

  for (let i = 0; i < len; i += 1) {
    ret[i] = PIN_CHARS[bytes[i] % len];
  }

  return ret.join('');
};
