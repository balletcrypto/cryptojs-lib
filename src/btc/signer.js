import {
  ECPair,
  Transaction,
  TransactionBuilder,
  networks as NETWORKS,
  Psbt,
  crypto
} from 'bitcoinjs-lib'
import bigNumber from 'bignumber.js'
const ECPairFromWIF = ECPair.fromWIF
export default (privateKey, utxos, sendAmount, fee, payerAddress, payeeAddress) => {
  const txb = new TransactionBuilder(NETWORKS.bitcoin)
  const isSegwit = (str) => str.startsWith('bc1')
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
  console.log(outputs)
  getUtxosKeyPair.forEach((utxo, index) => {
    if (isSegwit) {
      console.log(utxo.keyPair.publicKey)
      const hash = crypto.hash160(utxo.keyPair.publicKey)
      hash.unshift([0, hash.length])
      console.log(`0${hash.length}${hash}`)
      const scriptPubKey = hash
      console.log(scriptPubKey)
      txb.addInput(utxo.txid, utxo.txindex, 0xffffffff, scriptPubKey)
    } else {
      txb.addInput(utxo.txid, utxo.txindex)
    }
  })
  
  outputs.forEach(output => {
    txb.addOutput(output.address, output.value)
  });
  getUtxosKeyPair.forEach((utxo, index) => {
    txb.sign(index, utxo.keyPair)
  })
  console.log(txb.toHex())
  return txb
}