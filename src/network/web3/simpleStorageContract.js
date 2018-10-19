import {
  NonceTxMiddleware, SignedTxMiddleware, Client,
  Address, LocalAddress, CryptoUtils, LoomProvider, EvmContract
} from './loom.umd'
const chainId    = 'default'
const writeUrl   = 'https://loom.socu.io/websocket'
const readUrl    = 'https://loom.socu.io/queryws'

import Web3 from 'web3'
import {fromHexString} from "../../utils";
import {SecureStore} from "expo";
import * as loomjs from "./loom.umd";
const simpleStorageAddress = "0x8c77c61e6e787e1f88deec20aa1e2088ca247a1c"
const simpleStorageABI = require('rediwallet/src/contracts/SimpleStorage.json')

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

export default class SimpleStorateContract {
  constructor() {
    this.ready = false
  }

  async start(wallet) {
    console.log("in SimpleStorateContract.start")
    const privateKeyHex = await SecureStore.getItemAsync(wallet.address)
    console.log("in SimpleStorateContract.start", privateKeyHex)
    if (privateKeyHex === null) {
      return null
    }
    const privateKey = fromHexString(privateKeyHex)
    const publicKey = loomjs.CryptoUtils.publicKeyFromPrivateKey(privateKey)
    const client = getClient(privateKey, publicKey)
    const from = LocalAddress.fromPublicKey(publicKey).toString()
    const web3 = new Web3(new LoomProvider(client, privateKey))
    this.user = from

    client.on('error', msg => {
      console.error('Error on connect to client', msg)
      console.warn('Please verify if loom command is running')
    })
    const abi = simpleStorageABI.abi
    this._contract = new web3.eth.Contract(abi, simpleStorageAddress, {from: wallet.address})

    console.log('in send = ', this._contract.methods)
    const retM = await this._contract.methods.set(29).send({from: wallet.address})

    //
    // const ABI = [{"constant":false,"inputs":[{"name":"_postId","type":"uint256"},{"name":"_text","type":"string"}],"name":"newComment","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"posts","outputs":[{"name":"text","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"commentFromAccount","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_text","type":"string"}],"name":"newPost","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"hasPosts","outputs":[{"name":"_hasPosts","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"comments","outputs":[{"name":"text","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"postsFromAccount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"name":"commentsFromPost","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"postId","type":"uint256"},{"indexed":false,"name":"owner","type":"address"}],"name":"NewPostAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"postId","type":"uint256"},{"indexed":false,"name":"commentId","type":"uint256"},{"indexed":false,"name":"owner","type":"address"}],"name":"NewCommentAdded","type":"event"}]
    // const loomContractAddress = await client.getContractAddressAsync('SimpleSocialNetwork')
    // const contractAddress = CryptoUtils.bytesToHexAddr(loomContractAddress.local.bytes)

    this._contract = new web3.eth.Contract(ABI, contractAddress, {from})
    this.ready = true
  }
  async send(wallet, toAddress, amount) {
    console.log('in SimpleStorageContract.send()')
    return await this._contract.methods.set(5).send()
  }

  getUser() {
    return this.user
  }

  async newPost(text) {
    return await this._contract.methods.newPost(text).send()
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