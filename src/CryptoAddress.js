import { BITBOX } from 'bitbox-sdk'
import bnbSdk from '@binance-chain/javascript-sdk'
import { payments } from 'bitcoinjs-lib'
import { deriveAddress } from 'ripple-keypairs'
import ethPublickey2Address from 'ethereum-public-key-to-address'
import coinInfo from 'coininfo'

let bitbox = new BITBOX();

export const getBitcoinSeriesAddress = (publicKeyHex, currency) => {
  const pubkey = Buffer.from(publicKeyHex, 'hex')
  const network = coinInfo(currency).toBitcoinJS()
  const { address } = payments.p2pkh( { pubkey, network  } )
  return address.toString()
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