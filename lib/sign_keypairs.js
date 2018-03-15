'use strict'; // eslint-disable-line strict

var keypairs = require('ripple-keypairs');
var binary = require('ripple-binary-codec');
var b58check = require('ripple-bs58check');
var BigInteger = require('big-integer');

var _require = require('ripple-hashes'),
    computeBinaryTransactionHash = _require.computeBinaryTransactionHash;

function computeSignature(tx, privateKey, signAs) {
  var signingData = signAs ? binary.encodeForMultisigning(tx, signAs) : binary.encodeForSigning(tx);
  return keypairs.sign(signingData, privateKey);
}

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

function sign_keypair(txJSON, keypair) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var tx = JSON.parse(txJSON);

  tx.SigningPubKey = options.signAs ? '' : keypair.publicKey;

  if (options.signAs) {
    var signer = {
      Account: options.signAs,
      SigningPubKey: keypair.publicKey,
      TxnSignature: computeSignature(tx, keypair.privateKey, options.signAs)
    };
    if (!tx.Signers) tx.Signers = [];
    tx.Signers.push({ Signer: signer });
    tx.Signers = sortSigners(tx.Signers)
  } else {
    tx.TxnSignature = computeSignature(tx, keypair.privateKey);
  }

  var serialized = binary.encode(tx);
  return {
    id: computeBinaryTransactionHash(serialized),
    signedTransaction: serialized,
    txJson: tx
  };
}

module.exports = sign_keypair;
