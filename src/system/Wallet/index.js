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

export const initialAccounts = {
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

export async function getMnemonic() {
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

export const TRAFFIC_STATUS = {
  FAILING: 'FAILING',
  PASSING: 'PASSING',
  PAUSED: 'PAUSED',
  PENDING: 'PENDING',
}

export const initialFx = {
  [ ethereumAddress ]: {
    [ ethereumAddress ] : 1,
    [ krwtAddress ] : 135000,
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
    this.traffic = TRAFFIC_STATUS.PAUSED
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
      accounts: this.accounts,
      fx: this.fx
    }
  }
  static async generateWallet() {
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
        currency: "ETH",
        currencyAddress: ethereumAddress,
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
    if (wallet.fx) {
      this.fx = wallet.fx
    }
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
  getGasPrice = async () => {
    try {
      const ret = await this._web3.eth.getGasPrice()
      return parseInt(ret)
    } catch (e) {
      return null
    }
  }
  getEthBalance = () => {
    try {
      return this.accounts[ethereumAddress].balance
    } catch(e) {
      return 0
    }
  }
  getEthDecimals = () => {
    try {
      return this.accounts[ethereumAddress].decimals
    } catch(e) {
      return 0
    }
  }

  getEthPriceInKRW = async () => {
    const ethPriceUrl = "https://api.bithumb.com/public/ticker/ETH"
    try {
      const result = await axios({
        method: "GET",
        url: ethPriceUrl
      })
      if (result && result.status && result.status === 200) {
        if (result.data && result.data.status && result.data.status === "0000") {
          const midPrice = (parseInt(result.data.data.buy_price) + parseInt(result.data.data.sell_price)) / 2
          return midPrice
        }
      }
      return null
    } catch (e) {
      console.error("Error in getEthPriceInKRW ", e);
      console.log(e)
      return null
    }
  }
  getEthPriceInUSD = async () => {
    const ethPriceUrl = "https://api-kovan.etherscan.io/api?module=stats&action=ethprice&apiKey=" + etherscanAPIKey;

    try {
      const result = await axios({
        method: "GET",
        url: ethPriceUrl
      })
      if (result && result.status && result.status === "1" && result.message && result.message === "OK") {
        const midPrice = parseFloat(result.result.ethusd)
        return midPrice
      }
    } catch (e) {
      console.error("Error in getEthPriceInUSD ", e);
      console.log(e)
      return null
    }

  }
  fetchWalletFromNetwork = async () => {
    const ethMidPrice = await this.getEthPriceInKRW()
    if (ethMidPrice) {
      this.fx[ethereumAddress][krwtAddress] = ethMidPrice
      this.fx[krwtAddress][ethereumAddress] = 1 / parseFloat(ethMidPrice)
      this.fx[ethereumAddress][infleumAddress] = ethMidPrice / 20
      this.fx[infleumAddress][ethereumAddress] = 20 / parseFloat(ethMidPrice)
    }
    this.gasPrice = await this.getGasPrice()
    const gwei = Math.pow(10, 9)
    if (this.gasPrice === null) {
      this.traffic = TRAFFIC_STATUS.FAILING
    } else if (this.gasPrice > 20 * gwei) {
      this.traffic = TRAFFIC_STATUS.PAUSED
    } else if (this.gasPrice > 10 * gwei) {
      this.traffic = TRAFFIC_STATUS.PENDING
    } else {
      this.traffic = TRAFFIC_STATUS.PASSING
    }


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
  getTransactions = async (token=ethereumAddress, page=1, offset=10) => {
    if (token === ethereumAddress) {
      const module = "account"
      const action = "txlist"
      const address = this.address
      const startblock = 0
      const endblock = 99999999
      const sort = "desc"
      const url = etherscanAPIURL + "?module=" + module +
        "&action=" + action +
        "&address=" + address +
        "&startblock=" + startblock +
        "&endblock=" + endblock +
        "&page=" + page +
        "&offset=" + offset +
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
      // const urlll = 'https://api-kovan.etherscan.io/api?module=account&action=tokentx&contractaddress=0xb3A679368ED4E5fAD3e450081Da826193A4f8BBc&address=0x18EfFDa3D2F0Ef936dbBaD3dC85dAF2ba6540C81&startblock=0&endblock=99999999&page=1&offset=10&sort=desc&apiKey=X9ITJBMCCS6RDC96RB4AKV37KBEWBWSYWW'
      const module = "account"
      const action = "tokentx"
      const contractAddress = token
      const address = this.address
      const startblock = 0
      const endblock = 99999999
      const sort = "desc"
      const url = etherscanAPIURL + "?module=" + module +
        "&action=" + action +
        "&contractaddress=" + contractAddress +
        "&address=" + address +
        "&startblock=" + startblock +
        "&endblock=" + endblock +
        "&page=" + page +
        "&offset=" + offset +
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
  getFX = () => {
    if (this.fx === undefined) {
      return initialFx
    }
    return this.fx
  }
  getTotalAssetAmount = () => {
    if (this.fx === undefined) {
      this.fx = initialFx
    }
    let totalAssetAmount = 0
    const tokens = _.keys(this.accounts)
    for(let i = 0; i < tokens.length; i++){
      const token = tokens[i]
      try {
        totalAssetAmount = totalAssetAmount + parseFloat(this.accounts[token].balance) / Math.pow(10, this.accounts[token].decimals) * this.fx[token][this.currencyAddress]
      } catch(e) {
        try {
          totalAssetAmount = totalAssetAmount + parseFloat(this.accounts[token].balance) / Math.pow(10, this.accounts[token].decimals) * initialFx[token][this.currencyAddress]
        } catch(e){
          console.log(e)
        }
      }
    }
    return totalAssetAmount
  }
}