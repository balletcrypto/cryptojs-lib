import { expect } from "chai"
import { validateConfirmation } from '../src/confirmation'


describe('Test confirmation code with passphrase', function() {

  it('get the address ', () => {
    const confirmation = 'cfrm38V5rpAGAnc3ek4Wpra1S52UG4qaTL42GPbvNubHFxAG8vV6T82zZuPxNCjNedkCmUsNztm'
    const passphrase = 'enterpassphrase'
    const { valid, generatedAddress, publicKeyHex } = validateConfirmation(confirmation, passphrase)
    expect(valid).to.equals(true)
    expect(generatedAddress).to.equals("1HjL3uq8gHZcghRL9XgBpuzHTW67fhn4o1")
    expect(publicKeyHex).to.equals("048122e638203d94160cbb79ffc68815013631c94ecd2b44a9daba7d4b06b357ef88f12d80db22b9aa01047a601897937d16a64dcb3a3115316ab8c382ce68563a")
  })

})