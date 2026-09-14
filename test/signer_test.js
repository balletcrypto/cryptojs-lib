import { expect } from "chai"
import { calculateUTXOSize, isP2WPKH } from '../src/btc/signer'

describe('Test btc signer', () => {

  const p2pkhAddress = '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2'
  const p2wpkhAddress = 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4'
  const dogeAddress = 'D8YBBdoEyuZVvd3V8vNva9CKD9svqbUEo2'

  it('detect p2wpkh address successfully', () => {
    expect(isP2WPKH(p2wpkhAddress)).to.equals(true)
    expect(isP2WPKH(p2pkhAddress)).to.equals(false)
  })

  it('calculate p2pkh transaction size successfully', () => {
    // header 10 + p2pkh in 149 + p2pkh out 34 + p2pkh change 34
    const vsize = calculateUTXOSize(p2pkhAddress, [p2pkhAddress], [{ address: p2pkhAddress }], 'btc', false)
    expect(vsize).to.equals(227)
  })

  it('calculate p2wpkh transaction size successfully', () => {
    // header 10 + p2wpkh in 68 + p2wpkh out 31 + p2wpkh change 31
    const vsize = calculateUTXOSize(p2wpkhAddress, [p2wpkhAddress], [{ address: p2wpkhAddress }], 'btc', false)
    expect(vsize).to.equals(140)
  })

  it('calculate transaction size without change output successfully', () => {
    // header 10 + p2pkh in 149 + p2pkh out 34
    const vsize = calculateUTXOSize(p2pkhAddress, [p2pkhAddress], [{ address: p2pkhAddress }], 'btc', true)
    expect(vsize).to.equals(193)
  })

  it('round doge transaction size up to whole kilobytes', () => {
    // 227 vbytes rounded up to the next 1000
    const vsize = calculateUTXOSize(dogeAddress, [dogeAddress], [{ address: dogeAddress }], 'doge', false)
    expect(vsize).to.equals(1000)
  })
})
