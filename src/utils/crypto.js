import Color from "../constants/Colors";

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

const toHexString = bytes => {
  let hex = ""
  console.log(bytes)

  for (let i=0; i < bytes.length; i++) {
    hex = hex + (bytes[i].toString(16).length == 1 ? "0" + bytes[i].toString(16) : bytes[i].toString(16))
  }
  return hex
  // bytes.reduce((str, byte) => str + (byte.toString(16).length == 1 ? "0" + byte.toString(16) : byte.toString(16)), '');
}

const getHeaderTitle = (account) => {
  let currencyName
  if (account.currency) {
    if (account.currency === "ETH") {
      currencyName = "Ethereum"
    } else if (account.currency === "IFUM") {
      currencyName = "Infleum"
    } else if (account.currency === "KRWT") {
      currencyName = "KRW Tether"
    } else {
      currencyName = "Unknown"
    }
  } else {
    currencyName = "Loading..."
  }
  return currencyName
}

const getHeaderBackgroundColor = (account) => {
  let headerBackgroundColor
  if (account.currency) {
    if (account.currency === "ETH") {
      headerBackgroundColor = Color.ethereumColor
    } else if (account.currency === "IFUM") {
      headerBackgroundColor = Color.infleumColor
    } else if (account.currency === "KRWT") {
      headerBackgroundColor = Color.krwtColor
    } else {
      headerBackgroundColor = Color.backgroundColor
    }
  } else {
    headerBackgroundColor = Color.backgroundColor
  }
  return headerBackgroundColor
}
export {
  convertToKRWUnit,
  Currency,
  fromHexString,
  toHexString,
  getHeaderTitle,
  getHeaderBackgroundColor
}