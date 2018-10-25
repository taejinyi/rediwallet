import React from 'react'
import PropTypes from 'prop-types'
import { Animated, View, Text, PanResponder } from 'react-native'
import nacl from 'tweetnacl'
import HDWalletProvider from "truffle-hdwallet-provider";
import Web3 from "web3";
import {Currency, fromHexString} from "../../utils/crypto";
import ethers from "ethers";
import {SecureStore} from "expo";
import * as loomjs from "../../network/web3/loom.umd";

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
    this.accounts = {
      ETH: {
        balance: 0,
        currency: "ETH"
      },
      IFUM: {
        balance: 0,
        currency: "IFUM"
      },
      KRWT: {
        balance: 0,
        currency: "KRWT"
      },
    }
    this._contracts = {
      IFUM: undefined,
      KRWT: undefined,
    }
    this._web3 = undefined
    this._contract = undefined
    this.decimals = {
      ETH: 1000000000000000000,
      IFUM: 1,
      KRWT: 1,
    }
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
      accounts: {
        ETH: this.accounts["ETH"],
        IFUM: this.accounts["IFUM"],
        KRWT: this.accounts["KRWT"],
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
      accounts: {
        ETH: {
          balance: 0,
          currency: "ETH"
        },
        IFUM: {
          balance: 0,
          currency: "IFUM"
        },
        KRWT: {
          balance: 0,
          currency: "KRWT"
        },
      }
    }
    const _wallet = new Wallet()
    await _wallet.start(wallet)
    await _wallet.getFromNetwork()
    return _wallet.getJson()
  }

  start = async (wallet) => {
    if (this.ready) {
      return
    }
    this.nonce = wallet.nonce
    this.address = wallet.address
    this.currency = wallet.currency
    this.accounts = wallet.accounts

    const ABI = await this.getABIAsync("KRWT")
    const KRWTContractAddress = await this.getContractAddressAsync('KRWT')
    const IFUMContractAddress = await this.getContractAddressAsync('IFUM')
    this._web3 = await this.getWeb3(await getMnemonic())
    this._contracts = {
      IFUM: new this._web3.eth.Contract(ABI, IFUMContractAddress, {from: this.address}),
      KRWT: new this._web3.eth.Contract(ABI, KRWTContractAddress, {from: this.address}),
    }
    this.ready = true
  }

  getBalance = async (currency) => {
    if (currency === "ETH") {
      return await this._web3.eth.getBalance(this.address)
    }
    return await this._contracts[currency].methods.balanceOf(this.address).call()
  }

  getFromNetwork = async () => {
    if (!this.ready) {
      return null
    }
    this.accounts = {
      ETH: {
        balance: (await this.getBalance("ETH")) / this.decimals.ETH,
        currency: "ETH"
      },
      IFUM: {
        balance: (await this.getBalance("IFUM")) / this.decimals.IFUM,
        currency: "IFUM"
      },
      KRWT: {
        balance: (await this.getBalance("KRWT")) / this.decimals.KRWT,
        currency: "KRWT"
      },
    }
  }

  getTransactionsByAccount = async (myaccount, startBlockNumber, endBlockNumber) => {
    if (endBlockNumber == null) {
      endBlockNumber = eth.blockNumber;
      console.log("Using endBlockNumber: " + endBlockNumber);
    }
    if (startBlockNumber == null) {
      startBlockNumber = endBlockNumber - 1000;
      console.log("Using startBlockNumber: " + startBlockNumber);
    }
    console.log("Searching for transactions to/from account \"" + myaccount + "\" within blocks "  + startBlockNumber + " and " + endBlockNumber);

    for (let i = startBlockNumber; i <= endBlockNumber; i++) {
      if (i % 1000 === 0) {
        console.log("Searching block " + i);
      }
      let block = eth.getBlock(i, true);
      if (block != null && block.transactions != null) {
        block.transactions.forEach( function(e) {
          if (myaccount === "*" || myaccount === e.from || myaccount === e.to) {
            console.log("  tx hash          : " + e.hash + "\n"
              + "   nonce           : " + e.nonce + "\n"
              + "   blockHash       : " + e.blockHash + "\n"
              + "   blockNumber     : " + e.blockNumber + "\n"
              + "   transactionIndex: " + e.transactionIndex + "\n"
              + "   from            : " + e.from + "\n"
              + "   to              : " + e.to + "\n"
              + "   value           : " + e.value + "\n"
              + "   time            : " + block.timestamp + " " + new Date(block.timestamp * 1000).toString() + "\n"
              + "   gasPrice        : " + e.gasPrice + "\n"
              + "   gas             : " + e.gas + "\n"
              + "   input           : " + e.input);
          }
        })
      }
    }
  }
  getTransactionsFromNetwork = async (account) => {
    if (account.currency === "ETH") {
      return await this._web3.eth.getBalance(this.address)
    }
    try {
      const outgoingPastEvents = await this._contracts[account.currency].getPastEvents('Transfer', {filter: {from: this.address}})
      console.log("outgoingPastEvents", outgoingPastEvents)
      const incomingPastEvents = await this._contracts[account.currency].getPastEvents('Transfer', {filter: {to: this.address}})
      console.log("incomingPastEvents", incomingPastEvents)


      return await this._contracts[account.currency].methods.balanceOf(this.address).call()

    } catch (e) {
      console.error("Error in getTransactionsFromNetwork ", e);
    }
  }

  transfer = async (account, to, amount) => {
    if (account.currency === Currency.ETH.ticker) {
      try {
        const tx = await this._web3.eth.sendTransaction({to:to, from:this.address, value:this._web3.utils.toWei(amount.toString(), "ether")})
        return tx
      } catch (error) {
        console.log(error)
        return null
      }
    } else {
      try {
        return await this._contracts[account.currency].methods.transfer(to, amount).send()
      } catch (error) {
        console.log(error)
        return null
      }
    }
  }
  // async getTransactionsFromNetwork(account) {
  //   console.log('in getTransactionsFromNetwork account= ', account)
  //   // const ret = await this._contracts[account.currency].methods.a
  //   let n, bal, currentBlock, myAddr, i
  //   try {
  //     myAddr = this.address
  //     console.log('in getTransactionsFromNetwork myAddr= ', myAddr)
  //     currentBlock = await this._web3.eth.getBlockNumber();
  //     console.log('in getTransactionsFromNetwork currentBlock= ', currentBlock)
  //     n = await this._web3.eth.getTransactionCount(this.address, currentBlock);
  //     console.log('in getTransactionsFromNetwork n= ', n)
  //     console.log('in getTransactionsFromNetwork', myAddr, currentBlock, n)
  //     bal = await this.getBalance(account.currency, currentBlock);
  //     console.log('in getTransactionsFromNetwork', myAddr, currentBlock, n, bal)
  //     const eth = this._web3.eth
  //     for (i = currentBlock; i >= 0 && (n > 0 || bal > 0); --i) {
  //       try {
  //         const block = await eth.getBlock(i, true);
  //         console.log('in getTransactionsFromNetwork, block', i)
  //         if (block && block.transactions) {
  //           block.transactions.forEach(function (e) {
  //             if (myAddr === e.from) {
  //               if (e.from !== e.to)
  //                 bal = bal + e.value
  //               console.log(i, e.from, e.to, e.value.toString(10));
  //               --n;
  //             }
  //             if (myAddr === e.to) {
  //               if (e.from !== e.to)
  //                 bal = bal - e.value
  //               console.log(i, e.from, e.to, e.value.toString(10));
  //             }
  //           });
  //         }
  //       } catch (e) {
  //         console.error("Error in block " + i, e);
  //       }
  //     }
  //   } catch (e) {
  //     console.error("Error in getTransactionsFromNetwork ", e);
  //   }
  // }


}