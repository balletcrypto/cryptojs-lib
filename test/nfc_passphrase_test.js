import 'babel-polyfill'
import crypto from 'crypto'
import { expect } from "chai"
import { payments } from 'bitcoinjs-lib'
import { genIntermediate } from '../src/Intermediate'
import { validateConfirmation } from '../src/confirmation'
import { decryptEpkVcode } from '../src/bip38'
import { printFromIntermediate } from './helpers/printFromIntermediate'

// "Café" typed with a decomposed é (e + U+0301), as macOS and some IMEs produce it
const NFD_PASSPHRASE = 'Café-Ballet'
const NFC_PASSPHRASE = NFD_PASSPHRASE.normalize('NFC')

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
