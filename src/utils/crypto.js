const Currency = {
  IFUM: "IFUM",
  KRWT: "KRWT",
  ETH: "ETH"
}
import numeral from 'numeral'
import ethers from "ethers";
import {SecureStore} from "expo";
import * as loomjs from "../network/web3/loom.umd";

const convertToKRWUnit = (number) => {
  return numeral(number).format('0,000')
}

const fromHexString = hexString =>
  new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

const toHexString = bytes =>
  bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');


const generateAccount = async () => {
  // const hex = SecureStore.getItemAsync('seed')
  // if (hex == null) {
  //   return null
  // }
  // const seed = await ethers.utils.randomBytes(16)
  // console.log(loomjs.CryptoUtils)
  // // let privateKey = loomjs.CryptoUtils.generatePrivateKeyFromSeed(seed)
  // let privateKey = new Uint8Array(64)
  // // TODO: randomize
  // privateKey.set(seed);
  // privateKey.set(seed, seed.length);
  // privateKey.set(seed, seed.length * 2);
  // privateKey.set(seed, seed.length * 3);
  // const hex = loomjs.CryptoUtils.bytesToHex(seed)
  // const mnemonic = await ethers.HDNode.entropyToMnemonic(seed)
  // const publicKey = loomjs.CryptoUtils.generateKeys(privateKey)
  // console.log('randoms', privateKey, publicKey)
  // const publicAddress = loomjs.LocalAddress.fromPublicKey(publicKey).toString()
  // await SecureStore.setItemAsync('seed', hex)
  // await SecureStore.setItemAsync('address', hex)
  // await SecureStore.setItemAsync('privateKey', loomjs.CryptoUtils.bytesToHex(privateKey))
  // await SecureStore.setItemAsync('mnemonic', mnemonic)
  // const wallet = {
  //   address: publicAddress,
  //   balance: 0,
  //   seed: hex,
  //   mnemonic: mnemonic
  // }
  // return wallet
}


const generateWallet = async (currency) => {
  try {
    let wallet = null
    let nonce = await SecureStore.getItemAsync('nonce')
    if (!nonce) {
      nonce = 0
    } else {
      nonce = parseInt(nonce, 10)
    }
    nonce = nonce + 1
    await SecureStore.setItemAsync('nonce', nonce.toString())

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

    if (currency === Currency.KRWT || currency === Currency.IFUM) {
      const privateKeyHex = _newAccount.privateKey
      const privateKeySeed = fromHexString(privateKeyHex.substr(privateKeyHex.length - 64))
      let privateKey = new Uint8Array(64)
      // // TODO: randomize
      privateKey.set(privateKeySeed);
      privateKey.set(privateKeySeed, privateKeySeed.length);

      const publicKey = loomjs.CryptoUtils.publicKeyFromPrivateKey(privateKey)
      const address = loomjs.LocalAddress.fromPublicKey(publicKey).toString()
      console.log('setItemAsync', address, toHexString(privateKey))
      await SecureStore.setItemAsync(address, toHexString(privateKey))

      wallet = {
        address: address,
        nonce: nonce,
        currency: currency,
        balance: 0
      }
      return wallet
    } else {
      console.log('setItemAsync', _newAccount.address, _newAccount.privateKey)
      await SecureStore.setItemAsync(_newAccount.address, _newAccount.privateKey)

      wallet = {
        address: _newAccount.address,
        nonce: nonce,
        currency: currency,
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