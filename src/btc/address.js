import { address } from 'bitcoinjs-lib'

const convertSegwit2Legacy = (segwitAddress) => {
  const decodeAddress = address.fromBech32(segwitAddress)
  return address.toBase58Check(decodeAddress.data, 0x00)
}

export { convertSegwit2Legacy }