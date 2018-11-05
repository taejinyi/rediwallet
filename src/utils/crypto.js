const Currency = {
  IFUM: {
    ticker: "IFUM",
    address: "0xf337f6821b18b2eb24c44d74f3fa91128ead23f4",
  },
  KRWT: {
    ticker: "KRWT",
    address: "0xd5a23575d32849b7430dcd44d28c9fef3954068a"
  },
  ETH: {
    ticker: "ETH",
    address: "0x"
  },
}
import numeral from 'numeral'
const convertToKRWUnit = (number) => {
  return numeral(number).format('0,000')
}
import { toChecksumAddress } from 'ethereumjs-util'
const fromHexString = hexString =>
  new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

const toHexString = bytes =>
  bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');

export {
  convertToKRWUnit,
  Currency,
  fromHexString,
  toHexString,
}