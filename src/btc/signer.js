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
const isP2WPKH = (address) => address.startsWith('bc1') && address.length === 42
const calculateUTXOSize = (source, destinations, utxos) => {
  // TODO Better for calculatefee
  let vsize = 0;
  vsize += 10;
  // transaction input size
  // P2PKH: 149 vbytes
  // P2WPKH: 68 vbytes
  utxos.forEach(utxo => {
    if (isP2WPKH(utxo.address)) {
      vsize += 68
    } else {
      vsize += 149
    }
  })
  // Transaction output size:
  // P2PKH: 34 vbytes
  // P2SH: 32 vbytes
  // P2WPKH: 31 vbytes
  // P2WSH: 43 vbytes
  destinations.forEach(address => {
    if (isP2WPKH(address)) {
      vsize += 31
    } else {
      vsize += 34
    }
  })
  // give default output change address 
  if (isP2WPKH(source)) {
    vsize += 31;
  } else {
    vsize += 34;
  }

  return vsize
}

const ECPairFromWIF = ECPair.fromWIF
const signer = (privateKey, utxos, sendAmount, feePerByte, payerAddress, payeeAddress) => {
  const fee = calculateUTXOSize(payerAddress, [payeeAddress], utxos) * feePerByte
  const sendAmountSatoshi = new bigNumber(`${sendAmount}`).times(10 ** 8).toNumber()
  const txb = new TransactionBuilder(NETWORKS.bitcoin)
  const keyPair = new ECPairFromWIF(privateKey, NETWORKS.bitcoin)
  const getUtxoTotalAmount = utxos.length === 1 ?
    utxos[0].amount :
    utxos.reduce((r, a) => (r + a.amount), 0)
    // min_send_amount 1000
  // if (getUtxoTotalAmount - sendAmountSatoshi - fee < 1000) {
  //   alert('send error')
  //   return 
  // }
  const outputs = [{
    address: payeeAddress,
    value: sendAmountSatoshi
  }]
  if (getUtxoTotalAmount > sendAmountSatoshi + fee) {
    console.log("change amount")
    // change amount
    outputs.push({
      address: payerAddress,
      value: new bigNumber(`${getUtxoTotalAmount}`)
        .minus(sendAmountSatoshi)
        .minus(new bigNumber(`${fee}`).valueOf()).toNumber()
    })
  }
  utxos.forEach((utxo) => {
    if (isP2WPKH(utxo.address)) {
      const hash = crypto.hash160(keyPair.publicKey)
      const prefix = new Uint8Array(2)
      prefix[0] = 0
      prefix[1] = hash.length
      const scriptPubKey = concatTypedArrays(prefix, hash)
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
    if (isP2WPKH(utxo.address)) {
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

export { calculateUTXOSize, signer, isP2WPKH }