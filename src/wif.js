import { ECPair } from 'bitcoinjs-lib'
import coinInfo from 'coininfo'

export const getLitecoinWif = privateKeyHex => {
  return ECPair.fromPrivateKey(
    Buffer.from(privateKeyHex, 'hex'),
    {network: coinInfo('ltc').toBitcoinJS()}
  ).toWIF()
}

export const getBitcoinWif = privateKeyHex => {
  return ECPair.fromPrivateKey(
    Buffer.from(privateKeyHex, 'hex')
  ).toWIF()
}

export const getDashwif = privateKeyHex => {
  return ECPair.fromPrivateKey(
    Buffer.from(privateKeyHex, 'hex'),
    {network: coinInfo('dash').toBitcoinJS()}
  ).toWIF()
}

export const getDogewif = privateKeyHex => {
  return ECPair.fromPrivateKey(
    Buffer.from(privateKeyHex, 'hex'),
    {network: coinInfo('doge').toBitcoinJS()}
  ).toWIF()
}

export const getRvnWif = privateKeyHex => {
  return ECPair.fromPrivateKey(
    Buffer.from(privateKeyHex, 'hex'),
    {network: coinInfo('rvn').toBitcoinJS()}
  ).toWIF()
}