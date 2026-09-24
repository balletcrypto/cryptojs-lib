import 'babel-polyfill'
import crypto from 'crypto'
import { expect } from "chai"
import bs58 from 'bs58'
import { genIntermediate } from '../src/Intermediate'
import { validateConfirmation } from '../src/confirmation'
import { decryptEpkVcode } from '../src/bip38'
import { printFromIntermediate } from './helpers/printFromIntermediate'

const PASSPHRASE = 'ABCD-EFGH-JKLM-NPQR-STUV'

describe('Test BIP38 intermediate code', function() {

  it('uses the no-lot/sequence magic, matching how the passpoint is computed', async () => {
    const decoded = bs58.decode(await genIntermediate(PASSPHRASE))
    expect(decoded.slice(0, 8).toString('hex')).to.equals('2ce9b3e1ff39e251')
  })

  it('round-trips through a spec-compliant EC-multiply generator', async () => {
    const intermediate = await genIntermediate(PASSPHRASE)
    const printed = printFromIntermediate(intermediate, crypto.randomBytes(24))

    const { valid, generatedAddress } = await validateConfirmation(printed.confirmation, PASSPHRASE)
    expect(valid).to.equals(true)
    expect(generatedAddress).to.equals(printed.address)

    const { publicKeyHex } = decryptEpkVcode(printed.epk, PASSPHRASE)
    expect(publicKeyHex).to.equals(printed.publicKeyHex)
  })

})
