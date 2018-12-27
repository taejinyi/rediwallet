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
const ethereumAddress = "0x0000000000000000000000000000000000000000"
// const kovanURL = "https://kovan.infura.io/v3/5f559ee7fbf849c5a63c5a272dfe2530"

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

export const INITIAL_RPC_LIST = {
  MAINNET: {
    name: "MAINNET",
    url: "https://mainnet.infura.io",
    etherscanUrl: "https://api.etherscan.io/api",
    ethereumAddress: ethereumAddress,
    krwtAddress: "0xd5a23575d32849b7430dcd44d28c9fef3954068a",
    infleumAddress: "0xf337f6821b18b2eb24c44d74f3fa91128ead23f4"
  },
  ROPSTEN: {
    name: "ROPSTEN",
    url: "https://ropsten.infura.io",
    etherscanUrl: "https://api-ropsten.etherscan.io/api",
    ethereumAddress: ethereumAddress,
    krwtAddress: "0xF2a018F0aA772E4eB2c902b863a2FcEe0D632395",
    infleumAddress: "0x5D63a97780e2D8721F2eFfF7BF364322E7B8820d"
  },
  KOVAN: {
    name: "KOVAN",
    url: "https://kovan.infura.io",
    etherscanUrl: "https://api-kovan.etherscan.io/api",
    ethereumAddress: ethereumAddress,
    krwtAddress: "0xd5a23575d32849b7430dcd44d28c9fef3954068a",
    infleumAddress: "0xf337f6821b18b2eb24c44d74f3fa91128ead23f4"
  },
}

export const INITIAL_RPC = INITIAL_RPC_LIST.KOVAN

export const initialAccounts = {
  [ INITIAL_RPC.ethereumAddress ]: {
    balance: 0,
    currency: "ETH",
    address: INITIAL_RPC.ethereumAddress,
    decimals: 18,
  },
  [ INITIAL_RPC.krwtAddress ]: {
    balance: 0,
    currency: "KRWT",
    address: INITIAL_RPC.krwtAddress,
    decimals: 0,
  },
  [ INITIAL_RPC.infleumAddress ]: {
    balance: 0,
    currency: "IFUM",
    address: INITIAL_RPC.infleumAddress,
    decimals: 0,
  },
}

export const initialFx = {
  ETH: {
    ETH : 1,
    KRWT : 100000,
    IFUM : 5000,
  },
  KRWT: {
    ETH : 0.000001,
    KRWT : 1,
    IFUM : 0.05,
  },
  IFUM: {
    ETH : 0.0002,
    KRWT : 20,
    IFUM : 1,
  },
}

export default class Wallet {
  constructor() {
    this.ready = false
    this.currency = "ETH"
    this.currencyAddress = INITIAL_RPC.ethereumAddress
    this.nonce = 0
    this.address = undefined
    this.rpc = INITIAL_RPC
    this.accounts = initialAccounts[this.rpc.name]
    this.rpcList = INITIAL_RPC_LIST
    this._web3 = undefined
    this._contracts = {}
    this.fx = initialFx
    this.traffic = TRAFFIC_STATUS.PAUSED
  }

  getWeb3 = async (mnemonic, nonce=0) => {
    const provider = new HDWalletProvider(mnemonic, this.rpc.url, nonce)
    return new Web3(provider);
  }

  getERC20ABIAsync = async () => {
    return require("rediwallet/src/contracts/Infleum.json").abi
  }

  getJson = () => {
    return {
      address: this.address,
      nonce: this.nonce,
      currency: this.currency,
      rpc: this.rpc,
      rpcList: this.rpcList,
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
        accounts: initialAccounts,
      }
      return wallet
    } catch(e){
      console.log("error in generateWallet", e)
      return null
    }
  }

  start = async (wallet) => {
    console.log('starting')
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
    if (wallet.rpc) {
      this.rpc = wallet.rpc
    }
    if (wallet.rpcList) {
      this.rpcList = wallet.rpcList
    }
    this._web3 = await this.getWeb3(await getMnemonic())
    this.ready = true
  }

  reload = async () => {
    this._web3 = await this.getWeb3(await getMnemonic())
    this._contracts = {}

    this.accounts = {
      [ this.rpc.ethereumAddress ]: {
        balance: 0,
        currency: "ETH",
        address: this.rpc.ethereumAddress,
        decimals: 18,
      },
      [ this.rpc.krwtAddress ]: {
        balance: 0,
        currency: "KRWT",
        address: this.rpc.krwtAddress,
        decimals: 0,
      },
      [ this.rpc.infleumAddress ]: {
        balance: 0,
        currency: "IFUM",
        address: this.rpc.infleumAddress,
        decimals: 4,
      },
    }
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
    try {
      const ethMidPrice = await this.getEthPriceInKRW()
      if (ethMidPrice) {
        this.fx["ETH"]["KRWT"] = ethMidPrice
        this.fx["KRWT"]["ETH"] = 1 / parseFloat(ethMidPrice)
        this.fx["ETH"]["IFUM"] = ethMidPrice / 20
        this.fx["IFUM"]["ETH"] = 20 / parseFloat(ethMidPrice)
      }
      console.log('1 iWallet.fetchWalletFromNetwork')
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
        console.log('2 iWallet.fetchWalletFromNetwork.token', token)
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
    } catch(e) {
      console.log('error in iWallet.fetchWalletFromNetwork', e)
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
    try {
      if (token === ethereumAddress) {
        const module = "account"
        const action = "txlist"
        const address = this.address
        const startblock = 0
        const endblock = 99999999
        const sort = "desc"
        const url = this.rpc.etherscanUrl + "?module=" + module +
          "&action=" + action +
          "&address=" + address +
          "&startblock=" + startblock +
          "&endblock=" + endblock +
          "&page=" + page +
          "&offset=" + offset +
          "&sort=" + sort +
          "&apiKey=" + etherscanAPIKey;
        console.log('url in getTransactions', url)
        const result = await axios({
          method: "GET",
          url: url
        })
        return result
      }
      else {
        // const urlll = 'https://api-kovan.etherscan.io/api?module=account&action=tokentx&contractaddress=0xb3A679368ED4E5fAD3e450081Da826193A4f8BBc&address=0x18EfFDa3D2F0Ef936dbBaD3dC85dAF2ba6540C81&startblock=0&endblock=99999999&page=1&offset=10&sort=desc&apiKey=X9ITJBMCCS6RDC96RB4AKV37KBEWBWSYWW'
        const module = "account"
        const action = "tokentx"
        const contractAddress = token
        const address = this.address
        const startblock = 0
        const endblock = 99999999
        const sort = "desc"
        const url = this.rpc.etherscanUrl + "?module=" + module +
          "&action=" + action +
          "&contractaddress=" + contractAddress +
          "&address=" + address +
          "&startblock=" + startblock +
          "&endblock=" + endblock +
          "&page=" + page +
          "&offset=" + offset +
          "&sort=" + sort +
          "&apiKey=" + etherscanAPIKey;
        console.log('url in getTransactions', url)

        const result = await axios({
          method: "GET",
          url: url
        })
        return result
      }
    } catch (e) {
      console.error("Error in getTransactions ", e);
      console.log(e)
      return e
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
        const tokenCurrency = this.accounts[token].currency
        totalAssetAmount = totalAssetAmount + parseFloat(this.accounts[token].balance) / Math.pow(10, this.accounts[token].decimals) * this.fx[tokenCurrency][this.currency]
      } catch(e) {
        try {
          const tokenCurrency = this.accounts[token].currency
          totalAssetAmount = totalAssetAmount + parseFloat(this.accounts[token].balance) / Math.pow(10, this.accounts[token].decimals) * initialFx[tokenCurrency][this.currency]
        } catch(e){
          console.log(e)
        }
      }
    }
    return totalAssetAmount
  }
}
