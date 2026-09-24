import coinInfo from 'coininfo'
import wif from 'wif'
const getWIFByPrivateKeyHex = (currency, privateKeyHex, compressed = true) => {
  const WIFPrefix = coinInfo(currency).versions.private
  return wif.encode(WIFPrefix, Buffer.from(privateKeyHex, 'hex'), compressed)
}
export const getLitecoinWif = (privateKeyHex, compressed = true) => {
  return getWIFByPrivateKeyHex('ltc', privateKeyHex, compressed)
}

export const getBitcoinWif = (privateKeyHex, compressed = true) => {
  return getWIFByPrivateKeyHex('btc', privateKeyHex, compressed)
}

export const getDashwif = (privateKeyHex, compressed = true) => {
  return getWIFByPrivateKeyHex('dash', privateKeyHex, compressed)
}

export const getDogewif = (privateKeyHex, compressed = true) => {
  return getWIFByPrivateKeyHex('doge', privateKeyHex, compressed)
}

export const getRvnWif = (privateKeyHex, compressed = true) => {
  return getWIFByPrivateKeyHex('rvn', privateKeyHex, compressed)
}

export const getZecwif = (privateKeyHex, compressed = true) => {
  return getWIFByPrivateKeyHex('zec', privateKeyHex, compressed)
}

