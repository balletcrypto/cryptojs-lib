import coinInfo from 'coininfo'
import wif from 'wif'
const getWIFByPrivateKeyHex = (currency, privateKeyHex) => {
  const WIFPrefix = coinInfo(currency).versions.private
  return wif.encode(WIFPrefix, Buffer.from(privateKeyHex, 'hex'), true)
}
export const getLitecoinWif = privateKeyHex => {
  return getWIFByPrivateKeyHex('ltc', privateKeyHex)
}

export const getBitcoinWif = privateKeyHex => {
  return getWIFByPrivateKeyHex('btc', privateKeyHex)
}

export const getDashwif = privateKeyHex => {
  return getWIFByPrivateKeyHex('dash', privateKeyHex)
}

export const getDogewif = privateKeyHex => {
  return getWIFByPrivateKeyHex('doge', privateKeyHex)
}

export const getRvnWif = privateKeyHex => {
  return getWIFByPrivateKeyHex('rvn', privateKeyHex)
}

export const getZecwif = privateKeyHex => {
  return getWIFByPrivateKeyHex('zec', privateKeyHex)
}

