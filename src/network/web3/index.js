const KRWT = "KRWT"
const IFUM = "IFUM"
const ETH = "ETH"


import Web3 from 'web3'
import {Alert} from "react-native";
import {SecureStore} from "expo";
import ethers from 'ethers'
import { fromHexString } from '../../utils'
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

const client = new loomjs.Client(
  chainId,
  writeUrl,
  readUrl,
)
client.on('error', (message => {
  console.log('Hard to find - message : ', message)
}))


    // // await mainnet.eth.getBalance(address).then(console.log)
    // const publicKey = loomjs.CryptoUtils.publicKeyFromPrivateKey(privateKey)
    // const from = loomjs.LocalAddress.fromPublicKey(publicKey).toString()

const getBalance = async (address) => {
  try {
    const privateKeyHex = await SecureStore.getItemAsync(address)
    if (privateKeyHex === null) {
      return null
    }
    const privateKey = fromHexString(privateKeyHex)
    const loom = new Web3(
      new loomjs.LoomProvider(client, privateKey),
    );
    const abi = infleumContract.abi
    const contract = new loom.eth.Contract(abi, infleumAddress)
    return await contract.methods.balanceOf(address).call({address})
  } catch (error) {
    console.log(error)
    return null
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

