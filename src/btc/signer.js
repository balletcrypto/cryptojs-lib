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
  vsize += 20;
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

const isSegwit = (str) => str.startsWith('bc1')

const ECPairFromWIF = ECPair.fromWIF
const signer = (privateKey, utxos, sendAmount, feePerByte, payerAddress, payeeAddress) => {
  const vsize = 0
  const txb = new TransactionBuilder(NETWORKS.bitcoin)
  const fee = calculateUTXOSize(true, utxos) * feePerByte
  const keyPair = new ECPairFromWIF(privateKey, NETWORKS.bitcoin)
  const getUtxoTotalAmount = utxos.length === 1 ?
    utxos[0].amount :
    utxos.reduce((pre, next) => pre.amount + next.amount)
    // min_send_amount 1000
  if (getUtxoTotalAmount - sendAmountSatoshi - fee < 1000) {
    alert('send error')
    return 
  }
  const outputs = [{
    address: payeeAddress,
    value: sendAmountSatoshi
  }]
  if (getUtxoTotalAmount > sendAmountSatoshi + fee) {
    // change amount
    outputs.push({
      address: payerAddress,
      value: new bigNumber(`${getUtxoTotalAmount}`)
        .minus(sendAmountSatoshi)
        .minus(new bigNumber(`${fee}`).valueOf()).toNumber()
    })
  }
  utxos.forEach((utxo, index) => {
    if (isSegwit(utxo.address)) {
      console.log(keyPair.publicKey)
      const hash = crypto.hash160(keyPair.publicKey)
      const prefix = new Uint8Array(2)
      prefix[0] = 0
      prefix[1] = hash.length
      const scriptPubKey = concatTypedArrays(prefix, hash)
      console.log(scriptPubKey)
      txb.addInput(utxo.txid, utxo.txindex, undefined, Buffer.from(scriptPubKey, 'Hex'))
    } else {
      txb.addInput(utxo.txid, utxo.txindex)
    }
  })
  
  outputs.forEach(output => {
    txb.addOutput(output.address, output.value)
  });
  utxos.forEach((utxo, index) => {
    let mixIn = {}
    if (isSegwit(utxo.address)) {
      mixIn.prevOutScriptType = 'p2wpkh'
      mixIn.witnessValue = utxo.amount
    } else {
      mixIn.prevOutScriptType = 'p2pkh'
    }
    txb.sign({
      ...mixIn,
      vin: index,
      keyPair: keyPair
    })
  })
  const tx = txb.build()
  console.log(tx.toHex())
  return tx.toHex()
}

export { calculateUTXOSize, signer, isSegwit }