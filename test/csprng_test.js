import { expect } from "chai"
import { randomBytes } from '../src/bip38/crypto'
import { AES } from '../src/bip38/crypto.aes'
import { C_mode, C_pad } from '../src/bip38/crypto.blockmodes'

describe('Test legacy crypto randomness', function() {
  const mathRandom = Math.random

  beforeEach(() => {
    Math.random = () => { throw new Error('Math.random is not a CSPRNG') }
  })

  afterEach(() => {
    Math.random = mathRandom
  })

  it('randomBytes does not use Math.random', () => {
    const bytes = randomBytes(32)
    expect(bytes).to.have.lengthOf(32)
    bytes.forEach(b => expect(b).to.be.within(0, 255))
  })

  it('AES.encrypt IV generation does not use Math.random', () => {
    const ciphertext = AES.encrypt([1, 2, 3], new Array(32).fill(7), {
      mode: new C_mode.CBC(C_pad.pkcs7),
      asBytes: true
    })
    expect(ciphertext.length).to.be.above(16)
  })

  it('ISO 10126 padding does not use Math.random', () => {
    const message = [1, 2, 3]
    C_pad.iso10126.pad(AES, message)
    expect(message).to.have.lengthOf(16)
    expect(message[15]).to.equals(13)
  })
})
