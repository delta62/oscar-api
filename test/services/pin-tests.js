const { it, describe } = require('mocha');
const { expect } = require('code');
const { generatePin } = require('../../src/services/pin');

describe('pin service', () => {
  it('should return a string', () => {
    expect(generatePin(4)).to.be.a.string();
  });

  it('should return a string of the given length', () => {
    const len = 3;
    expect(generatePin(len)).to.have.length(len);
  });

  it('should include only numbers and uppercase letters', () => {
    expect(generatePin(100)).to.match(/^[A-Z0-9]+$/);
  });
});
