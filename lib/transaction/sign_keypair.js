'use strict'; // eslint-disable-line strict

var keypairs = require('ripple-keypairs');
var binary = require('ripple-binary-codec');

var _require = require('ripple-hashes'),
    computeBinaryTransactionHash = _require.computeBinaryTransactionHash;

function computeSignature(tx, privateKey, signAs) {
  var signingData = signAs ? binary.encodeForMultisigning(tx, signAs) : binary.encodeForSigning(tx);
  return keypairs.sign(signingData, privateKey);
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
    tx.Signers = [{ Signer: signer }];
  } else {
    tx.TxnSignature = computeSignature(tx, keypair.privateKey);
  }

  var serialized = binary.encode(tx);
  return {
    signedTransaction: serialized,
    id: computeBinaryTransactionHash(serialized)
  };
}

module.exports = sign_keypair;
