import { BITBOX } from 'bitbox-sdk'
import bnbSdk from '@binance-chain/javascript-sdk'
import { payments, crypto } from 'bitcoinjs-lib'
import { deriveAddress } from 'ripple-keypairs'
import ethPublickey2Address from 'ethereum-public-key-to-address'
import bs58check from 'bs58check'
import coinInfo from 'coininfo'
import cosmosLib from 'cosmos-lib'

let bitbox = new BITBOX();

export const getBitcoinSeriesAddress = (publicKeyHex, currency) => {
  const pubkey = Buffer.from(publicKeyHex, 'hex')
  const network = coinInfo(currency).toBitcoinJS()
  let payload = Buffer.allocUnsafe(21)
  payload.writeUInt8(network.pubKeyHash, 0)
  const hash = crypto.hash160(pubkey)
  hash.copy(payload, 1)
  return bs58check.encode(payload)
}

export const getDashAddress = publicKeyHex => {
  return getBitcoinSeriesAddress(publicKeyHex, 'dash')
}

export const getDogeAddress = publicKeyHex => {
  return getBitcoinSeriesAddress(publicKeyHex, 'doge')
}

export const getBitcoinCashAddress = publicKeyHex => {
  const address = getBitcoinAddress(publicKeyHex)
  return bitbox.Address.toCashAddress(address)
}

export const getBitcoinAddress = publicKeyHex => {
  return getBitcoinSeriesAddress(publicKeyHex, 'btc')
}

export const getLitecoinAddress = publicKeyHex => {
  return getBitcoinSeriesAddress(publicKeyHex, 'ltc')
}

export const getBTGAddress = publicKeyHex => {
  return getBitcoinSeriesAddress(publicKeyHex, 'btg')
}

export const getSegwitAddress = publicKeyHex => {
  const pubkey = Buffer.from(publicKeyHex, 'hex')
  const { address } = payments.p2wpkh( { pubkey } )
  return address
}

export const getXRPAddress = publicKeyHex => {
  return deriveAddress(publicKeyHex)
}

export const getEthAddress = publicKeyHex => {
  return ethPublickey2Address(publicKeyHex)
}

export const getQtumAddress = publicKeyHex => {
  return getBitcoinSeriesAddress(publicKeyHex, 'qtum')
}

export const getBnbAddress = publicKeyHex => {
  return bnbSdk.crypto.getAddressFromPublicKey(publicKeyHex, 'bnb')
}

export const getRvnAddress = publicKeyHex => {
  return getBitcoinSeriesAddress(publicKeyHex, 'rvn')
}

export const getZecAddress = publicKeyHex => {
  const pubkey = Buffer.from(publicKeyHex, 'hex')
  const network = coinInfo("zec").toBitcoinJS()
  let payload = Buffer.allocUnsafe(22)
  payload.writeUInt16BE(network.pubKeyHash, 0)
  const hash = crypto.hash160(pubkey)
  hash.copy(payload, 2)
  return bs58check.encode(payload)
}

export const getAtomAddress = publicKeyHex => {
  return cosmosLib.address.getAddress(publicKeyHex)
}
