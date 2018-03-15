'use strict'; // eslint-disable-line strict

var keypairs = require('ripple-keypairs');
var binary = require('ripple-binary-codec');

var _require = require('ripple-hashes'),
    computeBinaryTransactionHash = _require.computeBinaryTransactionHash;

var sortSigners = require('./sort_signer');

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
