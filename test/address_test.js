import { expect } from "chai"
import {
  getBTGAddress,
  getDashAddress,
  getDogeAddress,
  getLitecoinAddress,
  getBitcoinAddress,
  getEthAddress,
  getXRPAddress,
  getQtumAddress,
  getBnbAddress,
  getSegwitAddress,
  getBitcoinCashAddress,
  getZecAddress,
  getAtomAddress,
  getFilAddress,
  getCfxAddress
} from '../src/CryptoAddress'

describe('Test crypto currency address generate', () => {
  const publicKeyHex = "036a093266f21121b01ced5b6cdfbcf7ffdc0816ed18258a879ae09bde836d8602"
  it('get doge coin address successfully ', () => {
    const address = getDogeAddress(publicKeyHex)
    expect(address).to.equals("D8YBBdoEyuZVvd3V8vNva9CKD9svqbUEo2")
  })

  it('get dash coin address successfully ', () => {
    const address = getDashAddress(publicKeyHex)
    expect(address).to.equals("Xe5vUdWVeCsoYZTUGDhasuiWAMjKZiY33T")
  })

  it('get litecoin coin address successfully ', () => {
    const address = getLitecoinAddress(publicKeyHex)
    expect(address).to.equals("LNd2ubARm9uGeRZ3aUNfJQ6UYEWugem5Zf")
  })

  it('get bitcoin gold address successfully ', () => {
    const address = getBTGAddress(publicKeyHex)
    expect(address).to.equals("GMF14WBYfMGWU6ABLH3UT9NcFBwUaRTwTx")
  })

  it('get bitcoin address successfully ', () => {
    const address = getBitcoinAddress(publicKeyHex)
    expect(address).to.equals("14Q5eNrbgVfDPcrtQLPN2P2iL29dWbiDtZ")
  })
  it('get bitcoin segwit address successfully ', () => {
    const address = getSegwitAddress(publicKeyHex)
    expect(address).to.equals("bc1qy4zayjjp67mw07kcf5ltmak07xne96r6sfll39")
  })
  it('get bitcoin cash address successfully ', () => {
    const address = getBitcoinCashAddress(publicKeyHex)
    expect(address).to.equals("bitcoincash:qqj5t5j2g8tmdel6mpxna00kelc60yhg0gpnvxc7mz")
  })
  it('get eth address successfully ', () => {
    const address = getEthAddress(publicKeyHex)
    expect(address).to.equals("0x3Bd716720A5aEE40Cc08E7F2Abc156d7c30dE334")
  })
  it('get xrp address successfully ', () => {
    const address = getXRPAddress(publicKeyHex)
    expect(address).to.equals("rhQne4ibgVCDPcitQLP4pPp5Lp9dWb5DtZ")
  })
  it('get qtum address successfully', () => {
    const address = getQtumAddress(publicKeyHex)
    expect(address).to.equals("QQ14kg9JrxY2pkwupfhr9epLqH6LnbixzG")
  })
  it('get bnb address successfully', () => {
    const address = getBnbAddress(publicKeyHex)
    expect(address).to.equals("bnb1y4zayjjp67mw07kcf5ltmak07xne96r6yh7c5x")
  })
  it('get zcash address successfully', () => {
    const address = getZecAddress(publicKeyHex)
    expect(address).to.equals("t1MGgeiGjepSozFunLmCVAC8dagLiJZ6r39")
  })
  it('get atom address successfully', () => {
    const address = getAtomAddress("027c2c66986d3f878521685ea78a310ecf654a3998d104e284949e7ad6b959a731")
    expect(address).to.equals("cosmos1ukccrva9v2jadenh437lu5ryazzk75jdzu9lwn")
  })
  it('get fil address successfully', () => {
    const address = getFilAddress("044a8039f9f4c803602b5dd8d695a017ceaa1d3682581039d7eebdf149ebd60fffb096eed0ec1fab6b797df744cda0492764e6208be77ed4b04116cf0ff523ef4a")
    expect(address).to.equals("f1sepz6ghvbenhmojwxa4w5z7lzz3xf5wqgx2jxeq")
  })
  it('get cfx address successfully', () => {
    const address = getCfxAddress(publicKeyHex)
    expect(address).to.equals("cfx:aar7sfxwbkrs6ugpbdx9fm8bm5n6gdtdgu6xr0tv5t")
  })
})