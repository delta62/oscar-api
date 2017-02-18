const { it, describe } = require('mocha');
const { expect } = require('code');
const { generatePin } = require('../../src/services/pin');

describe('pin service', () => {
  it('should return a string', () => {
    expect(generatePin()).to.be.a.string();
  });

  it('should return a string of length 6', () => {
    expect(generatePin()).to.have.length(6);
  });

  it('should include only numbers and uppercase letters', () => {
    expect(generatePin()).to.match(/^[A-Z0-9]{6}$/);
  });
});
