import { crypto } from 'bitcoinjs-lib'
import { encodeAccountID } from 'ripple-address-codec'
import bs58check from 'bs58check'
import coinInfo from 'coininfo'
import { blake2b } from 'blakejs'
import { bech32 } from "bech32"
import { publicKeyConvert } from 'secp256k1'
import createKeccakHash from 'keccak'
import cashaddr from 'cashaddrjs'

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
  const hash = bs58check.decode(address).slice(1)

  const cashAddress = cashaddr.encode(
    'bitcoincash',
    'P2PKH',
    hash
  )
  return cashAddress
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
  const hash = crypto.hash160(pubkey)
  const words = bech32.toWords(Buffer.from(hash));
  words.unshift(0x00);
  return bech32.encode('bc', words);
}

export const getXRPAddress = publicKeyHex => {
  const pubkey = Buffer.from(publicKeyHex, 'hex')
  const hash = crypto.hash160(pubkey)
  return encodeAccountID(Buffer.from(hash))
}

export const getEthAddress = publicKeyHex => {
  let publicKey = publicKeyHex.slice(0, 2) === '0x' ? publicKeyHex.slice(2) : publicKeyHex
  publicKey = Buffer.from(publicKey, 'hex')
  publicKey = Buffer.from(publicKeyConvert(publicKey, false)).slice(1)
  const hash = createKeccakHash('keccak256').update(publicKey).digest()
  return toChecksumAddress(hash.slice(-20).toString('hex'))
}

export const getQtumAddress = publicKeyHex => {
  return getBitcoinSeriesAddress(publicKeyHex, 'qtum')
}

export const getBnbAddress = publicKeyHex => {
  const pubkey = Buffer.from(publicKeyHex, 'hex')
  const hash = crypto.hash160(pubkey)
  let words = bech32.toWords(Buffer.from(hash))
  return bech32.encode('bnb', words)
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
  const addrBytes = Buffer.concat([protocolByte, Buffer.from(payload)])
  const checksum = blake2b(addrBytes, null, 4)
  const bytes = Buffer.concat([Buffer.from(payload), Buffer.from(checksum)]);
  return `${prefix}${protocol}${encode(bytes, base32)}`
}

export const getAtomAddress = publicKeyHex => {
  const pubkey = Buffer.from(publicKeyHex, 'hex')
  const hash = crypto.hash160(pubkey)
  let words = bech32.toWords(Buffer.from(hash))
  return bech32.encode('cosmos', words)
}

function toChecksumAddress (address, chainId = null) {
  if (typeof address !== 'string') {
    return ''
  }

  if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
    throw new Error(`Given address "${address}" is not a valid Ethereum address.`)
  }

  const stripAddress = stripHexPrefix(address).toLowerCase()
  const prefix = chainId != null ? chainId.toString() + '0x' : ''
  const keccakHash = createKeccakHash('keccak256').update(prefix + stripAddress).digest()
    .toString('hex')
    .replace(/^0x/i, '')
  let checksumAddress = '0x'

  for (let i = 0; i < stripAddress.length; i++) {
    checksumAddress += parseInt(keccakHash[i], 16) >= 8 ? stripAddress[i].toUpperCase() : stripAddress[i]
  }

  return checksumAddress
}

function stripHexPrefix (value) {
  return value.slice(0, 2) === '0x' ? value.slice(2) : value
}
