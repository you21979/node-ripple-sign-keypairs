const sign = require("..");
const keypairs = require("ripple-keypairs");

const x1 = keypairs.deriveKeypair(keypairs.generateSeed())
const x2 = keypairs.deriveKeypair(keypairs.generateSeed())
x1.address = keypairs.deriveAddress(x1.publicKey)
x2.address = keypairs.deriveAddress(x2.publicKey)
const tx = JSON.parse('{"TransactionType":"Payment","Account":"","Destination":"","Amount":"100000000","Flags":2147483648,"Fee":"100000","LastLedgerSequence":30828104,"Sequence":25}')
tx.Account = x1.address
tx.Destination = x2.address
const txJSON = JSON.stringify(tx)
const txSign = sign(txJSON, x1)
console.log(txJSON)
console.log(txSign)
