import {
  ECPair,
  Transaction,
  TransactionBuilder,
  networks as NETWORKS,
  Psbt,
  crypto
} from 'bitcoinjs-lib'
import bigNumber from 'bignumber.js'
function concatTypedArrays(a, b) { // a, b TypedArray of same type
  var c = new (a.constructor)(a.length + b.length);
  c.set(a, 0);
  c.set(b, a.length);
  return c;
}
const calculateUTXOSize = (isSegwit, utxos) => {
 // TODO Better for calculatefee
 let vsize = 0;
 vsize += 10;
 // transaction input size
 if (isSegwit) {
  vsize += utxos.length * 68
 } else {
  vsize += utxos.length * 148
 }
 // transaction output size
 if (isSegwit) {
    vsize += 31;
 } else {
  vsize += 34;
 }
  return vsize
}
const ECPairFromWIF = ECPair.fromWIF
export default (privateKey, utxos, sendAmount, feePerByte, payerAddress, payeeAddress) => {
  const vsize = 0
  const txb = new TransactionBuilder(NETWORKS.bitcoin)
  const isSegwit = (str) => str.startsWith('bc1')
  const fee = calculateUTXOSize(true, utxos) * feePerByte
  const getUtxoTotalAmount = utxos.length === 1 ?
    utxos[0].amount :
    utxos.reduce((pre, next) => pre.amount + next.amount)
  const getUtxosKeyPair = utxos.map(utxo => {
    var ECPairFromWIF = ECPair.fromWIF
    return {
      ...utxo,
      keyPair: new ECPairFromWIF(privateKey, NETWORKS.bitcoin),
      privateKey: privateKey
    }
  })  
  const outputs = [{
    address: payeeAddress,
    value: new bigNumber(`${sendAmount}`).times(10 ** 8).toNumber()
  }]
  if (getUtxoTotalAmount > sendAmount + fee) {
    // change amount
    outputs.push({
      address: payerAddress,
      value: new bigNumber(`${getUtxoTotalAmount}`)
        .minus(new bigNumber(`${sendAmount}`).times(10 ** 8).valueOf())
        .minus(new bigNumber(`${fee}`).valueOf()).toNumber()
    })
  }
  getUtxosKeyPair.forEach((utxo, index) => {
    if (isSegwit(utxo.address)) {
      console.log(utxo.keyPair.publicKey)
      const hash = crypto.hash160(utxo.keyPair.publicKey)
      const prefix = new Uint8Array(2)
      prefix[0] = 0
      prefix[1] = hash.length
      const scriptPubKey = concatTypedArrays(prefix, hash)
      console.log(scriptPubKey)
      txb.addInput(utxo.txid, utxo.txindex, 0xffffffff, Buffer.from(scriptPubKey, 'Hex'))
    } else {
      txb.addInput(utxo.txid, utxo.txindex)
    }
  })
  
  outputs.forEach(output => {
    txb.addOutput(output.address, output.value)
  });
  getUtxosKeyPair.forEach((utxo, index) => {
    let mixIn = {}
    if (isSegwit(utxo.address)) {
      mixIn.prevOutScriptType = 'p2wpkh'
      mixIn.witnessValue = utxo.amount
    } else {
      mixIn.prevOutScriptType = 'p2pkh'
    }
    txb.sign({
      vin: index,
      keyPair: utxo.keyPair,
      ...mixIn
    })
  })
  const tx = txb.build()
  console.log(tx.toHex())
  return tx.toHex()
}