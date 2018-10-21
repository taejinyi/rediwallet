import {
  NonceTxMiddleware, SignedTxMiddleware, Client, Contract,
  Address, LocalAddress, CryptoUtils, LoomProvider, EvmContract
} from '../loom.umd'
const chainId    = 'default'
// const writeUrl   = 'https://loom.socu.io/websocket'
// const readUrl    = 'https://loom.socu.io/queryws'
const writeUrl   = 'wss://loom.socu.io/websocket'
const readUrl    = 'wss://loom.socu.io/queryws'
import HDWalletProvider from "truffle-hdwallet-provider"

import Web3 from 'web3'
import {fromHexString} from "src/utils";
import {SecureStore} from "expo";
import * as loomjs from "../loom.umd";
import ethers from "ethers";
import {Currency, toHexString} from "../../../utils/crypto";
import {toChecksumAddress} from "ethereumjs-util";

// const simpleStorageAddress = "0x1c589eba5d73699ae715060c5a8ced4fe93d39e5"
const simpleStorageAddress = "0x5c1ce88e643fa1ca6a9ca0e35b2021c54ddf4a7b"
const simpleStorageABI = require('../contracts/SimpleStorage.json')
const kovanURL = "https://kovan.infura.io/v3/5f559ee7fbf849c5a63c5a272dfe2530"

function getClient(privateKey, publicKey) {
  const client = new Client(
    chainId,
    writeUrl,
    readUrl,
  )
  client.txMiddleware = [
    new NonceTxMiddleware(publicKey, client),
    new SignedTxMiddleware(privateKey)
  ]

  return client
}

async function getContract(privateKey, publicKey) {
  console.log("in getContract")
  try {
    const client = getClient(privateKey, publicKey)
    // const contractAddr = simpleStorageAddress
    const contractAddr = new Address(client.chainId, LocalAddress.fromHexString(simpleStorageAddress))
    console.log("contractAddr", contractAddr)
    // const contractAddr = await client.getContractAddressAsync('BluePrint')
    const callerAddr = new Address(client.chainId, LocalAddress.fromPublicKey(publicKey))
    console.log("callerAddr", callerAddr)
    return new Contract({
      contractAddr,
      callerAddr,
      client
    })

  }
  catch(e){
    console.log(e)
  }
}

function getNmemonic() {
  return "pilot soft lottery source duty sentence exist wonder leaf same middle allow"
  // const mnemonic = "logic eyebrow ship sell artist whale fade inside sentence magnet prefer render"
  // try{
  //   return require('fs').readFileSync("./seed", "utf8").trim();
  // } catch(err){
  //   return "";
  // }
}

async function getKovanProvider() {
  // const kovanProvider = new Web3.providers.HttpProvider(kovanURL)
  // const kovanProvider = new HDWalletProvider(getNmemonic(), kovanURL)
  // console.log("in getKovanProvider: ", kovanProvider)
  const kovanProvider = new Web3(
    new Web3.providers.HttpProvider('https://mainnet.infura.io/'),
  );

  return kovanProvider
}

export default class SimpleStorateContract {
  constructor() {
    this.ready = false
  }

  async start(wallet) {
    console.log("in SimpleStorateContract.start")
    try{
      const mnemonic = getNmemonic()
      const path = "m/44'/60'/0'/0/0"
      const _newAccount = await ethers.Wallet.fromMnemonic(mnemonic, path);
      console.log("in SimpleStorateContract.start, privateKey: ", _newAccount)
      const kovanProvider = getKovanProvider()
      const web3 = new Web3(kovanProvider)

      const from = _newAccount.address
      this.from = from
      console.log(from)
      const balance = await web3.eth.getBalance(from)
      console.log("balance", balance)

      const abi = simpleStorageABI.abi
      this._contract = new web3.eth.Contract(abi, simpleStorageAddress, {from})
      console.log("Contract: ", this._contract)
      this.ready = true
    }catch(e){
      console.log(e)
    }

  }
  async send(wallet, toAddress, amount) {
    console.log('in SimpleStorageContract.send()')
    return await this._contract.methods.set(5).send()
  }
  async set(data) {
    console.log('in SimpleStorageContract.set()', data)
    console.log('in SimpleStorageContract._contract.methods: ', this._contract.methods)
    console.log('in SimpleStorageContract._contract.methods.get: ', this._contract.methods.get)
    // await this.newPost(data.toString())
    try {
    // //   // let params = new MapEntry()
    // //   //
    // //   // params.setKey('x')
    // //   // params.setValue(data)
    // //   // console.log('in SimpleStorageContract.set()', params)
    // //   // const tx = await this._contract.callAsync('set', params)
    // //   // console.log('in SimpleStorageContract.set()', data)
    //   const tx = await this._contract.methods.get().call({from: this.from})
      const tx = this._contract.methods.get()
      console.log('tx: ', tx)
      tx.call({from: this.from}).then(function(receipt){
        console.log(receipt)
      })
      // const tx = await this._contract.methods.set(data).send({from: this.from})
      // console.log(tx)
      // return tx
    } catch (e) {
      console.log(e)
    }

  }
  async get() {
    console.log('in SimpleStorageContract.get()')
    const data = await this._contract.methods.get().call()
    console.log('in SimpleStorageContract.get()', data)
    return data
  }

  getUser() {
    return this.user
  }

  async newPost(text) {
    console.log("newPost", text)
    try {
      const tx = await this._contract.methods.newPost(text).send()
      console.log(tx)
      return tx
    } catch (e) {
      console.log(e)
    }
  }

  async newComment(postId, text) {
    return await this._contract.methods.newComment(postId, text).send()
  }

  async hasPosts() {
    return await this._contract.methods.hasPosts().call()
  }

  async getPosts(index) {
    return await this._contract.methods.posts().call()
  }
}