  
import { decrypt } from 'bip38'
import { ECPair, payments } from 'bitcoinjs-lib'
import { decode } from './util/base58'
import { doubleSha256 } from './util/sha256'
import coinInfo from 'coininfo'

export const isBip38Format = epk => {
  return /^6P[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{56}$/.test(epk)
}

export const isValidPassphraseFormat = passphrase => {
  return /^[0-9A-Z]{4}-[0-9A-Z]{4}-[0-9A-Z]{4}-[0-9A-Z]{4}-[0-9A-Z]{4}$/.test(passphrase)
}

export function decryptEpkVcode(epk, vcode, currency = 'btc') {
  const { privateKey, compressed } = decrypt(epk, vcode)
  const network = coinInfo(currency).toBitcoinJS()
  const ecPair = ECPair.fromPrivateKey(privateKey, { compressed, network })
  const unCompressedEcPair = ECPair.fromPrivateKey(privateKey, { compressed: false })
  const unCompressedPublicKeyHex = unCompressedEcPair.publicKey.toString('hex')
  const publicKeyHex = ecPair.publicKey.toString('hex')
  const privateKeyHex = privateKey.toString('hex')
  const wif = ecPair.toWIF()

  if (verifyEpk(epk, publicKeyHex)) {
    return {
      publicKeyHex,
      privateKeyHex,
      wif,
      unCompressedPublicKeyHex
    }
  } else {
    throw new Error('invalid epk or passphrase')
  }
}

const verifyEpk = (epk, publicKeyHex) => {
  const epkHex = decode(epk)
  const pubkey = Buffer.from(publicKeyHex, 'hex')
  const { address } = payments.p2pkh({pubkey})
  const checksum = doubleSha256(address)

  if (checksum[0] !== epkHex[3] || checksum[1] !== epkHex[4] || checksum[2] !== epkHex[5] || checksum[3] !== epkHex[6]) {
    return false
  } else {
    return true
  }
}