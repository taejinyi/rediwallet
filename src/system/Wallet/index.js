import React from 'react'
import PropTypes from 'prop-types'
import { Animated, View, Text, PanResponder } from 'react-native'
import nacl from 'tweetnacl'
import HDWalletProvider from "truffle-hdwallet-provider";
import Web3 from "web3";
import {fromHexString} from "../../utils/crypto";
import ethers from "ethers";
import {SecureStore} from "expo";

const debug = true

const kovanURL = "https://kovan.infura.io"
const mainnetURL = "https://mainnet.infura.io"
// const kovanURL = "https://kovan.infura.io/v3/5f559ee7fbf849c5a63c5a272dfe2530"

async function getMnemonic() {
  if (debug) {
    return "pilot soft lottery source duty sentence exist wonder leaf same middle allow"
  }
  const hex = await SecureStore.getItemAsync('seed')
  let seed
  if (hex === null) {
    console.log("TODO: Error! seed is empty!")
    return "pilot soft lottery source duty sentence exist wonder leaf same middle allow"
  } else {
    seed = fromHexString(hex)
  }
  const mnemonic = await ethers.HDNode.entropyToMnemonic(seed)
  return mnemonic
  // const mnemonic = "logic eyebrow ship sell artist whale fade inside sentence magnet prefer render"
}

export default class Wallet {
  constructor() {
    this.ready = false
    this.currency = "KRWT"
    this.nonce = 0
    this.address = undefined
    this.balances = {
      ETH: 0,
      IFUM: 0,
      KRWT: 0,
    }
    this._contracts = {
      IFUM: undefined,
      KRWT: undefined,
    }
    this._web3 = undefined
    this._contract = undefined
  }

  getWeb3 = async (mnemonic, nonce=0) => {
    if (debug) {
      const provider = new HDWalletProvider(mnemonic, kovanURL, nonce)
      return new Web3(provider);
    } else {
      const provider = new HDWalletProvider(mnemonic, mainnetURL, nonce)
      return new Web3(provider);
    }
  }

  getABIAsync = async () => {
    return require("rediwallet/src/contracts/KRWT.json").abi
  }
  getContractAddressAsync = async (currency) => {
    if (debug) {
      if (currency === "KRWT") {
        return "0xd5a23575d32849b7430dcd44d28c9fef3954068a"
      } else if (currency === "IFUM") {
        return "0xf337f6821b18b2eb24c44d74f3fa91128ead23f4"
      } else {
        return "0x"
      }
    } else {
      if (currency === "KRWT") {
        return "0x"
      } else if (currency === "IFUM") {
        return "0x"
      } else {
        return "0x"
      }
    }
  }
  getJson = () => {
    return {
      address: this.address,
      nonce: this.nonce,
      currency: this.currency,
      balances: {
        ETH: this.balances["ETH"],
        IFUM: this.balances["IFUM"],
        KRWT: this.balances["KRWT"],
      }
    }
  }
  static async generateWallet(currency="KRWT") {
    let nonce = await SecureStore.getItemAsync('nonce')
    if (!nonce) {
      nonce = 0
    } else {
      nonce = parseInt(nonce, 10)
    }
    const nextNonce = nonce + 1
    await SecureStore.setItemAsync('nonce', nextNonce.toString())

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

    const wallet = {
      address: _newAccount.address,
      nonce: nonce,
      currency: currency,
      balances: {
        ETH: 0,
        IFUM: 0,
        KRWT: 0,
      }
    }
    const _wallet = new Wallet()
    await _wallet.start(wallet)
    await _wallet.getFromNetwork()
    const newWallet = _wallet.getJson()
    console.log('in generateWallet, new ! ', newWallet)
    return newWallet
  }

  async start(wallet) {
    this.nonce = wallet.nonce
    this.address = wallet.address
    this.currency = wallet.currency
    this.balances = wallet.balances

    this._web3 = await this.getWeb3(this.nonce)
    const ABI = await this.getABIAsync("KRWT")
    const KRWTContractAddress = await this.getContractAddressAsync('KRWT')
    const IFUMContractAddress = await this.getContractAddressAsync('IFUM')

    this._contracts = {
      IFUM: new this._web3.eth.Contract(ABI, IFUMContractAddress, {from: this.address}),
      KRWT: new this._web3.eth.Contract(ABI, KRWTContractAddress, {from: this.address}),
    }
    this.ready = true
  }
  async getFromNetwork() {
    if (!this.ready) {
      return null
    }
    this.balances = {
      ETH: await this.getBalance("ETH"),
      IFUM: await this.getBalance("IFUM"),
      KRWT: await this.getBalance("KRWT"),
    }
  }

  async getBalance(currency) {
    if (currency === "ETH") {
      return await this._web3.eth.getBalance(this.address)
    }
    return await this._contracts[currency].methods.balanceOf(this.address).call()
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