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
const infleumAddress = '0x6c8e8b624d211720fa055686634c57d402e3f228'
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


const send = async (wallet, toAddress, amount) => {
  console.log('in send = ', wallet, toAddress, amount)

  // var count = web3.eth.getTransactionCount("0x26...");
  // var abiArray = JSON.parse(fs.readFileSync('mycoin.json', 'utf-8'));
  // var contractAddress = "0x8...";
  // var contract = web3.eth.contract(abiArray).at(contractAddress);
  // var rawTransaction = {
  //     "from": "0x26...",
  //     "nonce": web3.toHex(count),
  //     "gasPrice": "0x04e3b29200",
  //     "gasLimit": "0x7458",
  //     "to": contractAddress,
  //     "value": "0x0",
  //     "data": contract.transfer.getData("0xCb...", 10, {from: "0x26..."}),
  //     "chainId": 0x03
  // };
  //
  // var privKey = new Buffer('fc3...', 'hex');
  // var tx = new Tx(rawTransaction);
  //
  // tx.sign(privKey);
  // var serializedTx = tx.serialize();
  //
  // web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function(err, hash) {
  //     if (!err)
  //         console.log(hash);
  //     else
  //         console.log(err);
  // });
  if (wallet.currency === Currency.ETH) {
    try {
      // const balance = await mainnet.eth.getBalance(wallet.address)
      // return balance
    } catch (error) {
      console.log(error)
      return null
    }
  } else {
    try {
      const privateKeyHex = await SecureStore.getItemAsync(wallet.address)
      if (privateKeyHex === null) {
        return null
      }
      const privateKey = fromHexString(privateKeyHex)
      if (privateKey === null) {
        return null
      }
      console.log('in send = ', privateKey, privateKeyHex)
      const loom = new Web3(
        new loomjs.LoomProvider(client, privateKey),
      );
      const abi = infleumContract.abi
      const contract = new loom.eth.Contract(abi, infleumAddress)
      console.log('in send = ', contract.methods)
      const retM = await contract.methods.transfer(toAddress, amount).send({from: wallet.address})
      console.log(retM)
  // var count = web3.eth.getTransactionCount("0x26...");
  // var abiArray = JSON.parse(fs.readFileSync('mycoin.json', 'utf-8'));
  // var contractAddress = "0x8...";
  // var contract = web3.eth.contract(abiArray).at(contractAddress);
  // var rawTransaction = {
  //     "from": "0x26...",
  //     "nonce": web3.toHex(count),
  //     "gasPrice": "0x04e3b29200",
  //     "gasLimit": "0x7458",
  //     "to": contractAddress,
  //     "value": "0x0",
  //     "data": contract.transfer.getData("0xCb...", 10, {from: "0x26..."}),
  //     "chainId": 0x03
  // };
  //
  // var privKey = new Buffer('fc3...', 'hex');
  // var tx = new Tx(rawTransaction);
  //
  // tx.sign(privKey);
  // var serializedTx = tx.serialize();
  //
  // web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function(err, hash) {
  //     if (!err)
  //         console.log(hash);
  //     else
  //         console.log(err);
  // });



    } catch (error) {
      console.log(error)
      return null
    }
  }
  return "finished"
}

export {
  getBalance,
  send
}

