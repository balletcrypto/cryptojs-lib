import { expect } from "chai"
import { getLitecoinWif, getBitcoinWif, getDogewif, getDashwif, getZecwif } from '../src/wif'



describe('Test crypto currency wif generate', () => {

  const privateKeyHex = '2154f9c69479511e0adb48eff9cd3a35b7c7611797015c9c8f8f0b5d2195a0df'

  it('get litecoin wif address successfully ', () => {
    const litecoinWif = getLitecoinWif(privateKeyHex)
    expect(litecoinWif).to.equals("T4AmcpHRGFD7KGZqoD1EQES9DCi1icBdwg2GiPrJ8prPbeGh2R6s")
  })

  it('get bitcoin wif address successfully ', () => {
    const bitcoinWif = getBitcoinWif(privateKeyHex)
    expect(bitcoinWif).to.equals("KxLWB4zErsEWYRvyFa4NBstmGM4heXAk8U81rbDkZrgE5kiVqEWK")
  })

  it('get doge wif address successfully', () =>{
    const dogeWif = getDogewif(privateKeyHex)
    expect(dogeWif).to.equals("QPjRKuoE7UidmxL1qquA56jNjP6Gh5JZ1ioveDcbJDHaXgcuhoxk")
  })

  it('get dash wif address successfully', () =>{
    const dashWif = getDashwif(privateKeyHex)
    expect(dashWif).to.equals("XCQRdLNcAYrxbkwMHL4Eh75nBNLH6KmzW3TvP7YwtDxKUumNEYqK")
  })

  it('get zec wif successfully', () => {
    const zecWif = getZecwif(privateKeyHex)
    expect(zecWif).to.equals("KxLWB4zErsEWYRvyFa4NBstmGM4heXAk8U81rbDkZrgE5kiVqEWK")
  })
})