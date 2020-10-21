import { BITBOX } from 'bitbox-sdk'
import bnbSdk from '@binance-chain/javascript-sdk'
import { payments, crypto } from 'bitcoinjs-lib'
import { deriveAddress } from 'ripple-keypairs'
import ethPublickey2Address from 'ethereum-public-key-to-address'
import bs58check from 'bs58check'
import coinInfo from 'coininfo'
import cosmosLib from 'cosmos-lib'
import { blake2b } from 'blakejs'

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

export const getFilAddress = publicKeyHex => {
  const base32 = "abcdefghijklmnopqrstuvwxyz234567"
  const encode = (buffer, alphabet) => {
    const length = buffer.byteLength
    const view = new Uint8Array(buffer)
    const padding = alphabet.indexOf('=') === alphabet.length - 1
  
    if (padding) {
      alphabet = alphabet.substring(0, alphabet.length - 2)
    }
  
    let bits = 0
    let value = 0
    let output = ''
  
    for (let i = 0; i < length; i++) {
      value = (value << 8) | view[i]
      bits += 8
  
      while (bits >= 5) {
        output += alphabet[(value >>> (bits - 5)) & 31]
        bits -= 5
      }
    }
  
    if (bits > 0) {
      output += alphabet[(value << (5 - bits)) & 31]
    }
  
    if (padding) {
      while (output.length % 8 !== 0) {
        output += '='
      }
    }
  
    return output
  }
  const hexToU8a = (hex) => {
    const value = hex.startsWith("0x") ? hex.slice(2) : hex;
    const valLength = value.length / 2;
    const bufLength = Math.ceil(valLength);
    const result = new Uint8Array(bufLength);
    const offset = Math.max(0, bufLength - valLength);
    // convert value to hex string
    for (let index = 0; index < bufLength; index++) {
      result[index + offset] = parseInt(value.substr(index * 2, 2), 16);
    }
    // return hex string
    return result;
  }
  const protocol = 1
  const prefix = "f"
  const protocolByte = new Buffer.alloc(1)
  protocolByte[0] = protocol
  const payload = blake2b(hexToU8a(publicKeyHex), null, 20)
  const addrBytes = Buffer.concat([protocolByte, payload])
  const checksum = blake2b(addrBytes, null, 4)
  const bytes = Buffer.concat([payload, Buffer.from(checksum)]);
  return `${prefix}${protocol}${encode(bytes, base32)}`
}

export const getAtomAddress = publicKeyHex => {
  const pubkey = Buffer.from(publicKeyHex, 'hex')
  return cosmosLib.address.getAddress(pubkey)
}
