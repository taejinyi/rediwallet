// import {
//   NonceTxMiddleware, SignedTxMiddleware, Client,
//   Address, LocalAddress, CryptoUtils, LoomProvider, EvmContract
// } from './loom.umd'

import Web3 from 'web3'
import {Alert} from "react-native";
import {SecureStore} from "expo";
import ethers from 'ethers'

// //import infleumContract from 'rediwallet/contracts/Infleum.json'
// const mainnet = new Web3(
//   new Web3.providers.HttpProvider('https://mainnet.infura.io/'),
// );
//
const chainId    = 'default'
const writeUrl   = 'https://loom.socu.io/websocket'
const readUrl    = 'https://loom.socu.io/queryws'
const infleumAddress = '0x243fb02dea0eb3908417922d1b7368a58e14e2a0'
const infleumContract = require('rediwallet/src/contracts/Infleum.json')

// import * as loomjs from './loom.umd'
const loomjs = require('./loom.umd')

const fromHexString = hexString =>
  new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

const toHexString = bytes =>
  bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');

const client = new loomjs.Client(
  chainId,
  writeUrl,
  readUrl,
)
client.on('error', (message => {
  console.log('Hard to find - message : ', message)
}))


const getBalance = async () => {
  try {
    // await mainnet.eth.getBalance(address).then(console.log)
    // await mainnet.eth.getBalance(address)
    // const mnemonic = await SecureStore.getItemAsync('mnemonic')
    // if (mnemonic == null) {
    //   return Alert.alert('Wait a few seconds', 'Wait a few seconds.')
    // }
    const path = "m/44'/60'/0'/0/" + walletIndex
    const random = ethers.utils.randomBytes(16)
    const mnemonic = ethers.HDNode.entropyToMnemonic(random)
    const wallet = await ethers.Wallet.fromMnemonic(mnemonic, path);
    // loomjs.ClientEvent.on('error', function(err) {
    //   console.log(err)
    // })
    // console.log('getBalance', wallet.privateKey)
    const subStr = wallet.privateKey.substr(2);
    // console.log(subStr)
    const privateKey = fromHexString(subStr + subStr)
    // console.log(privateKey)
    const publicKey = loomjs.CryptoUtils.publicKeyFromPrivateKey(privateKey)
    const from = loomjs.LocalAddress.fromPublicKey(publicKey).toString()
    // console.log("what's wrong?", publicKey, from)
    const loom = new Web3(
      new loomjs.LoomProvider(client, privateKey),
    );
    const abi = infleumContract.abi
    const contract = new loom.eth.Contract(abi, infleumAddress)
    return await contract.methods.balanceOf(from).call({from})
  } catch (error) {
    console.log(error)
    return 0
  }
}


  //
  //
  // const getBalance = async () => {
  //   try {
  //     const response = await axios({
  //       method: 'POST',
  //       url: globals.API_UNION_TRANSACTIONS.format(slug),
  //       data: {
  //         offset: offset,
  //         count: count,
  //       },
  //       headers: {
  //         Authorization: `Token ${token}`,
  //       }
  //     })
  //
  //     return response
  //   } catch (error) {
  //     return error.response
  //   }
  // }

export {
  getBalance,
}

