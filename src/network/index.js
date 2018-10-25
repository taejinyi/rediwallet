// import getBalance from './web3'
// const DEBUG = true
//
// let ETH_URL
// let IFUM_ADDRESS = '0xf337f6821b18b2eb24c44d74f3fa91128ead23f4'
// // let KRWT_ADDRESS = '0xf337f6821b18b2eb24c44d74f3fa91128ead23f4'
//
//
// const infleumContract = require('rediwallet/src/contracts/Infleum.json')
//
// if(DEBUG) {
//   // const kovanURL = "https://kovan.infura.io"
//   ETH_URL = "https://kovan.infura.io/v3/5f559ee7fbf849c5a63c5a272dfe2530"
// } else {
//   ETH_URL = "https://mainnet.infura.io/"
// }
//
// import { Currency } from '../utils/crypto'
// import Web3 from 'web3'
// import {Alert} from "react-native";
// import {SecureStore} from "expo";
// import ethers from 'ethers'
// import { fromHexString } from '../utils'
// import HDWalletProvider from "truffle-hdwallet-provider"
//
//
//
// function getMnemonic() {
//   return "pilot soft lottery source duty sentence exist wonder leaf same middle allow"
//   // const mnemonic = "logic eyebrow ship sell artist whale fade inside sentence magnet prefer render"
// }
//
// function getWeb3() {
//   const mnemonic = getMnemonic()
//   const provider = new HDWalletProvider(mnemonic, kovanURL)
//   const web3 = new Web3(provider);
//   return web3
// }
//
//
//
//
// import {
//   NonceTxMiddleware, SignedTxMiddleware, Client, Contract,
//   Address, LocalAddress, CryptoUtils, LoomProvider, EvmContract
// } from '../loom.umd'
// const chainId    = 'default'
// // const writeUrl   = 'https://loom.socu.io/websocket'
// // const readUrl    = 'https://loom.socu.io/queryws'
// const writeUrl   = 'wss://loom.socu.io/websocket'
// const readUrl    = 'wss://loom.socu.io/queryws'
// import HDWalletProvider from "truffle-hdwallet-provider"
//
// import Web3 from 'web3'
// import {fromHexString} from "src/utils";
// import {SecureStore} from "expo";
// import * as loomjs from "../loom.umd";
// import ethers from "ethers";
// import {Currency, toHexString} from "../../../utils/crypto";
// import {toChecksumAddress} from "ethereumjs-util";
//
// // const simpleStorageAddress = "0x1c589eba5d73699ae715060c5a8ced4fe93d39e5"
// const simpleStorageAddress = "0x5c1ce88e643fa1ca6a9ca0e35b2021c54ddf4a7b"
// const simpleStorageABI = require('../contracts/SimpleStorage.json')
// const kovanURL = "https://kovan.infura.io/v3/5f559ee7fbf849c5a63c5a272dfe2530"
//
// function getClient(privateKey, publicKey) {
//   const client = new Client(
//     chainId,
//     writeUrl,
//     readUrl,
//   )
//   client.txMiddleware = [
//     new NonceTxMiddleware(publicKey, client),
//     new SignedTxMiddleware(privateKey)
//   ]
//
//   return client
// }
//
// async function getContract(privateKey, publicKey) {
//   console.log("in getContract")
//   try {
//     const client = getClient(privateKey, publicKey)
//     // const contractAddr = simpleStorageAddress
//     const contractAddr = new Address(client.chainId, LocalAddress.fromHexString(simpleStorageAddress))
//     console.log("contractAddr", contractAddr)
//     // const contractAddr = await client.getContractAddressAsync('BluePrint')
//     const callerAddr = new Address(client.chainId, LocalAddress.fromPublicKey(publicKey))
//     console.log("callerAddr", callerAddr)
//     return new Contract({
//       contractAddr,
//       callerAddr,
//       client
//     })
//
//   }
//   catch(e){
//     console.log(e)
//   }
// }
//
// function getNmemonic() {
//   return "pilot soft lottery source duty sentence exist wonder leaf same middle allow"
//   // const mnemonic = "logic eyebrow ship sell artist whale fade inside sentence magnet prefer render"
// }
//
// async function getKovanProvider() {
//   const kovanProvider = new HDWalletProvider(getNmemonic(), kovanURL)
//   return kovanProvider
// }
//
// export default class Network {
//   constructor() {
//     this.ready = false
//   }
//
//   async start(wallet) {
//     console.log("in SimpleStorateContract.start")
//     try{
//       const mnemonic = getNmemonic()
//       const path = "m/44'/60'/0'/0/0"
//       const _newAccount = await ethers.Wallet.fromMnemonic(mnemonic, path);
//       console.log("in SimpleStorateContract.start, privateKey: ", _newAccount)
//       const kovanProvider = getKovanProvider()
//       const web3 = new Web3(kovanProvider)
//
//       const from = _newAccount.address
//       this.from = from
//       console.log(from)
//       const balance = await web3.eth.getBalance(from)
//       console.log("balance", balance)
//
//       // const privateKey = fromHexString(privateKeyHex)
//       // //
//       // const path = "m/44'/60'/0'/0/0"
//       // const _newAccount = await ethers.Wallet.fromMnemonic(mnemonic, path);
//       // const path1 = "m/44'/60'/0'/0/1"
//       // const _newAccount1 = await ethers.Wallet.fromMnemonic(mnemonic, path1);
//       // const privateKeyHex = _newAccount.privateKey.substr(_newAccount.privateKey.length - 64) + _newAccount1.privateKey.substr(_newAccount1.privateKey.length - 64)
//       // const privateKey = fromHexString(privateKeyHex)
//       // const privateKeyStr = "0x"+ privateKeyHex
//       //
//       // // let privateKey = new Uint8Array(64)
//       // // // // TODO: randomize
//       // // privateKey.set(privateKeySeed);
//       // // privateKey.set(privateKeySeed, privateKeySeed.length);
//       // // console.log("in SimpleStorateContract.start, privateKey: ", privateKey)
//       // const publicKey = loomjs.CryptoUtils.publicKeyFromPrivateKey(privateKey)
//       // console.log("in SimpleStorateContract.start publicKey: ", publicKey)
//       // const address = toChecksumAddress(loomjs.LocalAddress.fromPublicKey(publicKey).toString())
//       // console.log("in SimpleStorateContract.start", address)
//       // await SecureStore.setItemAsync(address, toHexString(privateKey))
//       // console.log("in SimpleStorateContract.start")
//       // console.log("Hex: ", toHexString(privateKey), toHexString(publicKey))
//       // const privateKeyHex = "586E327235753778214125442A472D4B6150645367566B59703373367639792F423F4528482B4D6251655468576D5A7134743777217A25432646294A404E6352"
//       // const publicKeyHex = "423F4528482B4D6251655468576D5A7134743777217A25432646294A404E6352"
//       // // //       [Error] de2dc42c1f9d924c79ab14d322bdf332bc218bf3d23c3b15dfcb10ceb818749a156a31f6ba867a3a31fd5752c4bd41e25239b7081bc89cbb5ef6b244e088ba5b
//       // // [Error] 156a31f6ba867a3a31fd5752c4bd41e25239b7081bc89cbb5ef6b244e088ba5b
//       // const privateKey = fromHexString(privateKeyHex)
//       // const publicKey = fromHexString(publicKeyHex)
//       // // // console.log(privateKey, publicKey)
//       // const privateKeyHex = await SecureStore.getItemAsync(wallet.address)
//       // console.log("in SimpleStorateContract.start", privateKeyHex)
//       // if (privateKeyHex === null) {
//       //   return null
//       // }
//       // 4aee1c98bc7a5688221230aa673970e6edd1d61e9805f197e85bce7bee42176d39eb4f0286bae24dbb731554f2098205d8c91cc42c0901d679ec9201b24a534d
//       // 39eb4f0286bae24dbb731554f2098205d8c91cc42c0901d679ec9201b24a534d
//
//       // const privateKey = fromHexString(privateKeyHex)
//       // const client = getClient(privateKey, publicKey)
//       // const from = LocalAddress.fromPublicKey(publicKey).toString()
//       // const web3 = new Web3(new LoomProvider(client, privateKey))
//
//       // client.on('error', msg => {
//       //   console.error('Error on connect to client', msg)
//       //   console.warn('Please verify if loom command is running')
//       // })
//       // const ABI = [{"constant":false,"inputs":[{"name":"_postId","type":"uint256"},{"name":"_text","type":"string"}],"name":"newComment","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"posts","outputs":[{"name":"text","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"commentFromAccount","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_text","type":"string"}],"name":"newPost","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"hasPosts","outputs":[{"name":"_hasPosts","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"comments","outputs":[{"name":"text","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"postsFromAccount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"name":"commentsFromPost","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"postId","type":"uint256"},{"indexed":false,"name":"owner","type":"address"}],"name":"NewPostAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"postId","type":"uint256"},{"indexed":false,"name":"commentId","type":"uint256"},{"indexed":false,"name":"owner","type":"address"}],"name":"NewCommentAdded","type":"event"}]
//       // const loomContractAddress = await client.getContractAddressAsync('SimpleSocialNetwork')
//       // const contractAddress = CryptoUtils.bytesToHexAddr(loomContractAddress.local.bytes)
//       // const contractAddress = new Address(client.chainId, LocalAddress.fromHexString("0xc54f4cfa82bbf2a416e9cd9864a81229efe47eac"))
//       // const contractAddress = "0xc54f4cfa82bbf2a416e9cd9864a81229efe47eac"
//       // this._contract = new web3.eth.Contract(ABI, contractAddress, {from})
//       //
//       const abi = simpleStorageABI.abi
//       // this._contract = new web3.eth.Contract(abi, simpleStorageAddress, {from})
//       // this._contract = await getContract(privateKey, publicKey)
//       // console.log('in send = ', this._contract)
//       // const retM = await this._contract.methods.set(29).send({from: wallet.address})
//
//       //
//       // const ABI = [{"constant":false,"inputs":[{"name":"_postId","type":"uint256"},{"name":"_text","type":"string"}],"name":"newComment","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"posts","outputs":[{"name":"text","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"commentFromAccount","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_text","type":"string"}],"name":"newPost","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"hasPosts","outputs":[{"name":"_hasPosts","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"comments","outputs":[{"name":"text","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"postsFromAccount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"name":"commentsFromPost","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"postId","type":"uint256"},{"indexed":false,"name":"owner","type":"address"}],"name":"NewPostAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"postId","type":"uint256"},{"indexed":false,"name":"commentId","type":"uint256"},{"indexed":false,"name":"owner","type":"address"}],"name":"NewCommentAdded","type":"event"}]
//       // const loomContractAddress = await client.getContractAddressAsync('SimpleSocialNetwork')
//       // const contractAddress = CryptoUtils.bytesToHexAddr(loomContractAddress.local.bytes)
//
//       this._contract = new web3.eth.Contract(abi, simpleStorageAddress, {from})
//       console.log("Contract: ", this._contract)
//       this.ready = true
//     }catch(e){
//       console.log(e)
//     }
//
//   }
//   async send(wallet, toAddress, amount) {
//     console.log('in SimpleStorageContract.send()')
//     return await this._contract.methods.set(5).send()
//   }
//   async set(data) {
//     console.log('in SimpleStorageContract.set()', data)
//     console.log('in SimpleStorageContract._contract.methods: ', this._contract.methods)
//     console.log('in SimpleStorageContract._contract.methods.get: ', this._contract.methods.get)
//     // await this.newPost(data.toString())
//     try {
//     // //   // let params = new MapEntry()
//     // //   //
//     // //   // params.setKey('x')
//     // //   // params.setValue(data)
//     // //   // console.log('in SimpleStorageContract.set()', params)
//     // //   // const tx = await this._contract.callAsync('set', params)
//     // //   // console.log('in SimpleStorageContract.set()', data)
//     //   const tx = await this._contract.methods.get().call({from: this.from})
//       const tx = this._contract.methods.get()
//       console.log('tx: ', tx)
//       tx.call({from: this.from}).then(function(receipt){
//         console.log(receipt)
//       })
//       // const tx = await this._contract.methods.set(data).send({from: this.from})
//       // console.log(tx)
//       // return tx
//     } catch (e) {
//       console.log(e)
//     }
//
//   }
//   async get() {
//     console.log('in SimpleStorageContract.get()')
//     const data = await this._contract.methods.get().call()
//     console.log('in SimpleStorageContract.get()', data)
//     return data
//   }
//
//   getUser() {
//     return this.user
//   }
//
//   async newPost(text) {
//     console.log("newPost", text)
//     try {
//       const tx = await this._contract.methods.newPost(text).send()
//       console.log(tx)
//       return tx
//     } catch (e) {
//       console.log(e)
//     }
//   }
//
//   async newComment(postId, text) {
//     return await this._contract.methods.newComment(postId, text).send()
//   }
//
//   async hasPosts() {
//     return await this._contract.methods.hasPosts().call()
//   }
//
//   async getPosts(index) {
//     return await this._contract.methods.posts().call()
//   }
// }