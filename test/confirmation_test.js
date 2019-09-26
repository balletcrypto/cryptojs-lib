import { expect } from "chai"
import { validateConfirmation } from '../src/confirmation'


describe('Test confirmation code with passphrase', function() {

  it('get the address ', () => {
    const confirmation = 'cfrm38V5rpAGAnc3ek4Wpra1S52UG4qaTL42GPbvNubHFxAG8vV6T82zZuPxNCjNedkCmUsNztm'
    const passphrase = 'enterpassphrase'
    const { valid, generatedAddress } = validateConfirmation(confirmation, passphrase)
    expect(valid).to.equals(true)
    expect(generatedAddress).to.equals("1HjL3uq8gHZcghRL9XgBpuzHTW67fhn4o1")
  })

})