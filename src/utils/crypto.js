import Color from "../constants/Colors";
import numeral from 'numeral'

const numberToString = (number) => {
  let numFraction = 6
  if (number > 1000) {
    numFraction = 0
  } else if (number > 100) {
    numFraction = 4
  }
  const fraction = number - Math.floor(number)
  const strFraction = fraction.toFixed(numFraction)
  if (fraction > 0.00001) {
    return numeral(Math.floor(number)).format('0,000') + strFraction.substr(1)
  } else if(fraction > 0 ) {
    const decimals = 1000000000
    const small = number * decimals

    const fraction = small - Math.floor(small)
    if (small > 1000) {
      numFraction = 0
    } else if (small > 100) {
      numFraction = 4
    }

    const strFraction = fraction.toFixed(numFraction)
    return numeral(Math.floor(small)).format('0,000') + strFraction.substr(1) + "e-9"
  } else {
    return numeral(Math.floor(number)).format('0,000')
  }
}

const fromHexString = hexString =>
  new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

const toHexString = bytes => {
  let hex = ""
  for (let i=0; i < bytes.length; i++) {
    hex = hex + (bytes[i].toString(16).length === 1 ? "0" + bytes[i].toString(16) : bytes[i].toString(16))
  }
  return hex
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
  numberToString,
  fromHexString,
  toHexString,
  getHeaderTitle,
  getHeaderBackgroundColor
}