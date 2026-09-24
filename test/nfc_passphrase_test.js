import 'babel-polyfill'
import crypto from 'crypto'
import { expect } from "chai"
import bs58 from 'bs58'
import bs58check from 'bs58check'
import CryptoScrypt from 'scryptsy'
import secp256k1 from 'secp256k1'
import { payments } from 'bitcoinjs-lib'
import { genIntermediate } from '../src/Intermediate'
import { validateConfirmation } from '../src/confirmation'
import { decryptEpkVcode } from '../src/bip38'

// "Café" typed with a decomposed é (e + U+0301), as macOS and some IMEs produce it
const NFD_PASSPHRASE = 'Café-Ballet'
const NFC_PASSPHRASE = NFD_PASSPHRASE.normalize('NFC')

const hash256 = buf => crypto.createHash('sha256').update(crypto.createHash('sha256').update(buf).digest()).digest()

const aes256Encrypt = (block, key) => {
  const cipher = crypto.createCipheriv('aes-256-ecb', key, null)
  cipher.setAutoPadding(false)
  return Buffer.concat([cipher.update(block), cipher.final()])
}

const xor = (a, b) => Buffer.from(a.map((byte, i) => byte ^ b[i]))

// BIP38 EC-multiply "printer" step: intermediate code -> encrypted private key + confirmation code
function printFromIntermediate (intermediate, seedb, compressed = true) {
  const decoded = bs58.decode(intermediate)
  const ownerEntropy = decoded.slice(8, 16)
  const passpoint = decoded.slice(16, 49)
  const flagByte = compressed ? 0x20 : 0x00

  const factorb = hash256(seedb)
  const generatedPubKey = Buffer.from(secp256k1.publicKeyTweakMul(passpoint, factorb, compressed))
  const { address } = payments.p2pkh({ pubkey: generatedPubKey })
  const addressHash = hash256(Buffer.from(address, 'latin1')).slice(0, 4)

  const derived = CryptoScrypt(passpoint, Buffer.concat([addressHash, ownerEntropy]), 1024, 1, 1, 64)
  const derivedHalf1 = derived.slice(0, 32)
  const derivedHalf2 = derived.slice(32, 64)

  const encryptedPart1 = aes256Encrypt(xor(seedb.slice(0, 16), derivedHalf1.slice(0, 16)), derivedHalf2)
  const encryptedPart2 = aes256Encrypt(
    xor(Buffer.concat([encryptedPart1.slice(8, 16), seedb.slice(16, 24)]), derivedHalf1.slice(16, 32)),
    derivedHalf2
  )
  const epk = bs58check.encode(Buffer.concat([
    Buffer.from([0x01, 0x43, flagByte]), addressHash, ownerEntropy, encryptedPart1.slice(0, 8), encryptedPart2
  ]))

  const pointb = Buffer.from(secp256k1.publicKeyCreate(factorb, true))
  const pointbPrefix = pointb[0] ^ (derivedHalf2[31] & 0x01)
  const pointbx1 = aes256Encrypt(xor(pointb.slice(1, 17), derivedHalf1.slice(0, 16)), derivedHalf2)
  const pointbx2 = aes256Encrypt(xor(pointb.slice(17, 33), derivedHalf1.slice(16, 32)), derivedHalf2)
  const confirmation = bs58check.encode(Buffer.concat([
    Buffer.from([0x64, 0x3B, 0xF6, 0xA8, 0x9A, flagByte]), addressHash, ownerEntropy,
    Buffer.from([pointbPrefix]), pointbx1, pointbx2
  ]))

  return { epk, confirmation, address, publicKeyHex: generatedPubKey.toString('hex') }
}

describe('Test passphrase Unicode normalization (NFD vs NFC)', function() {

  it('mints, verifies and spends a wallet from a decomposed passphrase', async () => {
    const intermediate = await genIntermediate(NFD_PASSPHRASE)
    const printed = printFromIntermediate(intermediate, crypto.randomBytes(24))

    for (const passphrase of [NFD_PASSPHRASE, NFC_PASSPHRASE]) {
      const { valid, generatedAddress } = await validateConfirmation(printed.confirmation, passphrase)
      expect(valid).to.equals(true)
      expect(generatedAddress).to.equals(printed.address)

      const { publicKeyHex } = decryptEpkVcode(printed.epk, passphrase)
      expect(publicKeyHex).to.equals(printed.publicKeyHex)
    }
  })

  it('verifies a fixed confirmation code with either form of the passphrase', async () => {
    const confirmation = 'cfrm38VUPRu8Q1m8d8otaW2jq9FjMozbWXnGnjxL9bEtsDxYD8XKimuf5V1SnLykW4auAhG7Voz'
    const epk = '6PnSmCnmBeNZ2jJbMQVE7jKVbe8d4mdKk2AvnR6ZyHT4pjczKrAR8JCVui'
    const expectedAddress = '1PwicR5YkBC8LqtmqYp3vvhQW2BsKBpJST'

    for (const passphrase of [NFD_PASSPHRASE, NFC_PASSPHRASE]) {
      const { valid, generatedAddress } = await validateConfirmation(confirmation, passphrase)
      expect(valid).to.equals(true)
      expect(generatedAddress).to.equals(expectedAddress)

      const { publicKeyHex } = decryptEpkVcode(epk, passphrase)
      const { address } = payments.p2pkh({ pubkey: Buffer.from(publicKeyHex, 'hex') })
      expect(address).to.equals(expectedAddress)
    }
  })

})
