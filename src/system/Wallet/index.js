import _ from 'lodash'
import React from 'react'
import HDWalletProvider from "truffle-hdwallet-provider";
import Web3 from "web3";
import {Currency, fromHexString} from "../../utils/crypto";
import ethers from "ethers";
import {SecureStore} from "expo";
import axios from 'axios'
const debug = true

const kovanURL = "https://kovan.infura.io"
const mainnetURL = "https://mainnet.infura.io"
const etherscanAPIKey = "X9ITJBMCCS6RDC96RB4AKV37KBEWBWSYWW"
const etherscanAPIURL = "https://api-kovan.etherscan.io/api"
// const kovanURL = "https://kovan.infura.io/v3/5f559ee7fbf849c5a63c5a272dfe2530"

const ethereumAddress = "0x0000000000000000000000000000000000000000"
const krwtAddress = "0xd5a23575d32849b7430dcd44d28c9fef3954068a"
const infleumAddress = "0xf337f6821b18b2eb24c44d74f3fa91128ead23f4"

async function getMnemonic() {
  const hex = await SecureStore.getItemAsync('seed')
  let seed
  if (hex === null) {
    console.log("TODO: Error! seed is empty!")
    return null
  } else {
    seed = fromHexString(hex)
  }
  return await ethers.HDNode.entropyToMnemonic(seed)
}

const initialAccounts = {
  [ ethereumAddress ]: {
    balance: 0,
    currency: "ETH",
    address: ethereumAddress,
    decimals: 18,
  },
  [ krwtAddress ]: {
    balance: 0,
    currency: "KRWT",
    address: krwtAddress,
    decimals: 0,
  },
  [ infleumAddress ]: {
    balance: 0,
    currency: "IFUM",
    address: infleumAddress,
    decimals: 0,
  },
}

const initialFx = {
  [ ethereumAddress ]: {
    [ ethereumAddress ] : 1,
    [ krwtAddress ] : 186700,
    [ infleumAddress ] : 9335,
  },
  [ krwtAddress ]: {
    [ ethereumAddress ] : 0.000005356186395,
    [ krwtAddress ] : 1,
    [ infleumAddress ] : 0.05,
  },
  [ infleumAddress ]: {
    [ ethereumAddress ] : 0.0001071237279,
    [ krwtAddress ] : 20,
    [ infleumAddress ] : 1,
  },
}

export default class Wallet {
  constructor() {
    this.ready = false
    this.currency = "ETH"
    this.currencyAddress = ethereumAddress
    this.nonce = 0
    this.address = undefined
    this.accounts = initialAccounts
    this.unions = {}
    this._web3 = undefined
    this._contracts = {}
    this.fx = initialFx
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

  getERC20ABIAsync = async () => {
    return require("rediwallet/src/contracts/Infleum.json").abi
  }
  getContractAddressAsync = async (currency) => {
    if (debug) {
      if (currency === "KRWT") {
        return "0xd5a23575d32849b7430dcd44d28c9fef3954068a"
      } else if (currency === "IFUM") {
        return "0xf337f6821b18b2eb24c44d74f3fa91128ead23f4"
      } else {
        return ethereumAddress
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
      currencyAddress: this.currencyAddress,
      accounts: this.accounts
    }
  }
  static async generateWallet(currency="ETH") {
    try {
      const nonce = 0
      // let nonce = await SecureStore.getItemAsync('nonce')
      // if (!nonce) {
      //   nonce = 0
      // } else {
      //   nonce = parseInt(nonce, 10)
      // }
      // const nextNonce = nonce + 1
      // await SecureStore.setItemAsync('nonce', nextNonce.toString())
      const mnemonic = await getMnemonic()
      const path = "m/44'/60'/0'/0/" + nonce
      const _newAccount = await ethers.Wallet.fromMnemonic(mnemonic, path);
      const wallet = {
        address: _newAccount.address,
        nonce: nonce,
        currency: currency,
        accounts: initialAccounts
      }
      return wallet
    } catch(e){
      console.log("error in generateWallet", e)
      return null
    }
  }

  start = async (wallet) => {
    if (this.ready) {
      return
    }
    this.address = wallet.address
    this.nonce = wallet.nonce
    this.currency = wallet.currency
    this.currencyAddress = wallet.currencyAddress
    this.accounts = wallet.accounts
    this._web3 = await this.getWeb3(await getMnemonic())
    this.ready = true
  }

  getTokenContract = async (token) => {
    if (token === ethereumAddress) {
      return null
    }
    if (!this._contracts.hasOwnProperty(token) || this._contracts[token] === undefined) {
      const ABI = await this.getERC20ABIAsync()
      this._contracts[token] = new this._web3.eth.Contract(ABI, token, {from: this.address})
    }
    return this._contracts[token]
  }
  getBalance = async (token) => {
    if (token === ethereumAddress) {
      return await this._web3.eth.getBalance(this.address)
    }
    const contract = await this.getTokenContract(token)
    return await contract.methods.balanceOf(this.address).call()
  }
  getSymbol = async (token) => {
    if (token === ethereumAddress) {
      return "ETH"
    }
    const contract = await this.getTokenContract(token)
    try {
      return await contract.methods.symbol().call()
    } catch(e) {
      return "Unknown"
    }
  }
  getDecimals = async (token) => {
    if (token === ethereumAddress) {
      return 18
    }
    const contract = await this.getTokenContract(token)
    try {
      return await contract.methods.decimals().call()
    } catch(e) {
      return 0
    }
  }

  fetchWalletFromNetwork = async () => {
    const tokens = _.keys(this.accounts)
    for(let i = 0; i < tokens.length; i++){
      const token = tokens[i]
      const account = {
        [ token ]: {
          address: token,
          balance: await this.getBalance(token),
          currency: await this.getSymbol(token),
          decimals: await this.getDecimals(token),
        }
      }
      // console.log(token, 'account', account)
      this.accounts = Object.assign({}, this.accounts, account)
    }
    console.log("final in fetchFromNetwork", this.accounts)
  }

  transfer = async (account, to, amount) => {
    if (account.address === ethereumAddress) {
      try {
        const tx = await this._web3.eth.sendTransaction({to:to, from:this.address, value:this._web3.utils.toWei(amount.toString(), "ether")})
        return tx
      } catch (error) {
        console.log(error)
        return null
      }
    } else {
      try {
        const contract = await this.getTokenContract(account.address)
        return await contract.methods.transfer(to, amount).send()
      } catch (error) {
        console.log(error)
        return null
      }
    }
  }

  getTransactions = async (account, offset=0, count=20) => {
    if (account.currency === "ETH") {
      const module = "account"
      const action = "txlist"
      const address = this.address
      const startblock = 0
      const endblock = 99999999
      const page = 1
      const sort = "desc"
      const url = etherscanAPIURL + "?module=" + module +
        "&action=" + action +
        "&address=" + address +
        "&startblock=" + startblock +
        "&endblock=" + endblock +
        "&page=" + page +
        "&offset=" + offset +
        "&count=" + count +
        "&sort=" + sort +
        "&apiKey=" + etherscanAPIKey;
      try {
        const result = await axios({
          method: "GET",
          url: url
        })
        return result
      } catch (e) {
        console.error("Error in getTransactions ", e);
        console.log(e)
        return e
      }
    } else {
      const module = "account"
      const action = "tokentx"
      const contractAddress = account.address
      const address = this.address
      const startblock = 0
      const endblock = 99999999
      const page = 1
      const count = 10
      const sort = "desc"
      const url = etherscanAPIURL + "?module=" + module +
        "&action=" + action +
        "&contractaddress=" + contractAddress +
        "&address=" + address +
        "&startblock=" + startblock +
        "&endblock=" + endblock +
        "&page=" + page +
        "&offset=" + offset +
        "&count=" + count +
        "&sort=" + sort +
        "&apiKey=" + etherscanAPIKey;
      try {
        const result = await axios({
          method: "GET",
          url: url
        })
        return result
      } catch (e) {
        console.error("Error in getTransactions ", e);
        console.log(e)
        return e
      }
    }
  }
  getTransaction = async (hash) => {
    return await this._web3.eth.getTransaction(hash)
  }
  getTotalAssetAmount = () => {
    let totalAssetAmount = 0
    const tokens = _.keys(this.accounts)
    for(let i = 0; i < tokens.length; i++){
      const token = tokens[i]
      totalAssetAmount = totalAssetAmount + this.accounts[token].balance / Math.pow(10, this.accounts[token].decimals) * this.fx[token][this.currencyAddress]
    }
    return totalAssetAmount
  }
}