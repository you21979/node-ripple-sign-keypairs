'use strict';
var b58check = require('ripple-bs58check');
var BigInteger = require('big-integer');

function sortSigners(signers) {
  if (signers.length === 1) return signers
  var hashInts = signers.map(function(signer) {
    return BigInteger(b58check.decode(signer.Signer.Account).toString('hex'), 16)
  })
  for (var i = 1; i < hashInts.length; i++) {
    if (hashInts[0].greaterOrEquals(hashInts[i])) {
      hashInts = [hashInts[i]].concat(hashInts.slice(0,i)).concat(hashInts.slice(i+1))
      signers = [signers[i]].concat(signers.slice(0,i)).concat(signers.slice(i+1))
    }
  }
  return signers
}

module.exports = sortSigners
