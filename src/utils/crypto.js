import nacl from "tweetnacl/nacl";

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
import ethers from "ethers";
import {SecureStore} from "expo";
import * as loomjs from "../network/web3/loom.umd";
import Web3 from 'web3'
const convertToKRWUnit = (number) => {
  return numeral(number).format('0,000')
}
import { toChecksumAddress } from 'ethereumjs-util'
const fromHexString = hexString =>
  new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

const toHexString = bytes =>
  bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');


const initiate = async () => {

}
const generateWallet = async (currencyTicker) => {
  try {
    let wallet = null
    let nonce = await SecureStore.getItemAsync('nonce')
    if (!nonce) {
      nonce = 0
    } else {
      nonce = parseInt(nonce, 10)
    }
    const nextNonce = nonce + 1
    await SecureStore.setItemAsync('nonce', nextNonce.toString())
    console.log("in generateWallet", nonce, nextNonce)

    const hex = await SecureStore.getItemAsync('seed')
    let seed
    if (hex === null) {
      return null
    } else {
      seed = fromHexString(hex)
    }
    const mnemonic = await ethers.HDNode.entropyToMnemonic(seed)
    const path = "m/44'/60'/0'/0/" + nonce
    const _newAccount = await ethers.Wallet.fromMnemonic(mnemonic, path);

    // await SecureStore.setItemAsync(_newAccount.address, _newAccount.privateKey)
    // wallet = {
    //   address: _newAccount.address,
    //   nonce: nonce,
    //   currency: currencyTicker,
    //   balance: 0
    // }
    // return wallet

    if (currencyTicker === Currency.KRWT.ticker) {
      const privateKeyHex = _newAccount.privateKey
      const privateKeySeed = fromHexString(privateKeyHex.substr(privateKeyHex.length - 64))
      const pair = nacl.sign.keyPair.fromSeed(privateKeySeed)
      console.log('in importMnemonic, pair = ', pair)


      const publicKey = loomjs.CryptoUtils.publicKeyFromPrivateKey(pair.secretKey)
      const address = toChecksumAddress(loomjs.LocalAddress.fromPublicKey(pair.publicKey).toString())
      await SecureStore.setItemAsync(address, toHexString(pair.secretKey))
      console.log("in generateWallet address", address, toHexString(pair.secretKey))

      wallet = {
        address: address,
        nonce: nonce,
        currency: currencyTicker,
        balance: 0
      }
      console.log("in generateWallet", wallet)
      return wallet
    } else {
      console.log('setItemAsync', _newAccount.address, _newAccount.privateKey)
      await SecureStore.setItemAsync(_newAccount.address, _newAccount.privateKey)

      wallet = {
        address: _newAccount.address,
        nonce: nonce,
        currency: currencyTicker,
        balance: 0
      }
      return wallet
    }
  }
  catch(e) {
    console.log(e)
  }
  return null
}


export {
  convertToKRWUnit,
  generateWallet,
  Currency,
  fromHexString,
  toHexString,
}