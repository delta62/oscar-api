const { expect } = require('code');

exports.err = function err(code) {
  return function expectError(res) {
    let body = res.body;
    expect(body.message, 'message').to.be.a.string();
    expect(body.code, 'code').to.equal(code);
    expect(Object.keys(body), 'body length').to.have.length(2);
  };
};
