const KRWT = "KRWT"
const IFUM = "IFUM"
const ETH = "ETH"

import { Currency } from '../../utils/crypto'
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

const mainnet = new Web3(
  new Web3.providers.HttpProvider('https://mainnet.infura.io/'),
);

const getBalance = async (wallet) => {
  console.log('in getBalance wallet = ', wallet)
  if (wallet.currency === Currency.ETH) {
    try {
      const balance = await mainnet.eth.getBalance(wallet.address)
      return balance
    } catch (error) {
      console.log(error)
      return null
    }
  } else {
    try {
      const privateKeyHex = await SecureStore.getItemAsync(wallet.address)
      console.log('in getBalance', privateKeyHex)
      if (privateKeyHex === null) {
        return null
      }
      const privateKey = fromHexString(privateKeyHex)
      if (privateKey === null) {
        return null
      }
      console.log('in getBalance', privateKey)
      const loom = new Web3(
        new loomjs.LoomProvider(client, privateKey),
      );
      const abi = infleumContract.abi
      const contract = new loom.eth.Contract(abi, infleumAddress)
      return await contract.methods.balanceOf(wallet.address).call({from: wallet.address})
    } catch (error) {
      console.log(error)
      return null
    }
  }
}

export {
  getBalance,
}

