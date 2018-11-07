import React from 'react'
import PropTypes from 'prop-types'
import { Animated, View, Text, PanResponder } from 'react-native'
import nacl from 'tweetnacl'
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
        currency: "ETH",
        address: "0x",
        decimals: 1000000000000000000,
      },
      IFUM: {
        balance: 0,
        currency: "IFUM",
        address: infleumAddress,
        decimals: 1,
      },
      KRWT: {
        balance: 0,
        currency: "KRWT",
        address: krwtAddress,
        decimals: 1,
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
          currency: "ETH",
          address: "0x",
          decimals: 1000000000000000000,
        },
        IFUM: {
          balance: 0,
          currency: "IFUM",
          address: infleumAddress,
          decimals: 1,
        },
        KRWT: {
          balance: 0,
          currency: "KRWT",
          address: krwtAddress,
          decimals: 1,
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
    if (!this.currency){
      return 0
    }
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
        currency: "ETH",
        address: "0x",
        decimals: 1000000000000000000,
      },
      IFUM: {
        balance: (await this.getBalance("IFUM")) / this.decimals.IFUM,
        currency: "IFUM",
        address: infleumAddress,
        decimals: 1,
      },
      KRWT: {
        balance: (await this.getBalance("KRWT")) / this.decimals.KRWT,
        currency: "KRWT",
        address: krwtAddress,
        decimals: 1,
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
      try {
        const module = "account"
        const action = "txlist"
        const address = this.address
        const startblock = 0
        const endblock = 99999999
        const page = 1
        const offset = 0
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
          return result.data
        } catch(e) {
          console.log(e)
          return e
        }


        // const options = {
        //   fromBlock: "0x0",
        //   toBlock: 'latest',
        //   address: "0x0",
        // }
        // const pastLogs = await this._web3.eth.getPastLogs(options)
        // console.log("pastLogs", pastLogs)
        // const outgoingPastEvents = await this._contracts[account.currency].getPastEvents('Transfer', {filter: {from: this.address}}, {fromBlock: 0, toBlock: 'latest'})
        // console.log("outgoingPastEvents", outgoingPastEvents)
        //
        //
        // console.log('address: ', this.address)
        // this._web3.eth.getPastLogs({
        //     address: this.address,
        // })
        // .then(console.log);
        /*

        // Total Iteration

        let n, bal, currentBlock, myAddr, i
        myAddr = this.address
        console.log('in getTransactionsFromNetwork myAddr= ', myAddr)
        currentBlock = await this._web3.eth.getBlockNumber();
        console.log('in getTransactionsFromNetwork currentBlock= ', currentBlock)
        n = await this._web3.eth.getTransactionCount(this.address, currentBlock);
        console.log('in getTransactionsFromNetwork n= ', n)
        console.log('in getTransactionsFromNetwork', myAddr, currentBlock, n)
        bal = await this.getBalance(account.currency, currentBlock);
        console.log('in getTransactionsFromNetwork', myAddr, currentBlock, n, bal)
        currentBlock = 9179625
        const eth = this._web3.eth
        for (i = currentBlock; i >= 0 && (n > 0 || bal > 0); --i) {
          try {
            const block = await eth.getBlock(i, true);
            if (i % 10 === 0)
              console.log('in getTransactionsFromNetwork, block', i)
            if (block && block.transactions) {
              block.transactions.forEach(function (e) {
                if (myAddr === e.from) {
                  if (e.from !== e.to)
                    bal = bal + e.value
                  console.log(i, e.from, e.to, e.value.toString(10));
                  console.log("Outgoing", e);
                  --n;
                }
                if (myAddr === e.to) {
                  if (e.from !== e.to)
                    bal = bal - e.value
                  console.log(i, e.from, e.to, e.value.toString(10));
                  console.log("Incoming: ", e);
                }
              });
            }
          } catch (e) {
            console.error("Error in block " + i, e);
          }
        }
        */
      } catch (e) {
        console.error("Error in getTransactionsFromNetwork ", e);
      }
      return await this._web3.eth.getBalance(this.address)
    }
    /*
    Outgoing Object {
      "blockHash": "0x4629ddd657ec1f907e505542aeea7153614c59f5dfb3060647f54209f3c631ea",
      "blockNumber": 9179600,
      "chainId": null,
      "condition": null,
      "creates": null,
      "from": "0x18EfFDa3D2F0Ef936dbBaD3dC85dAF2ba6540C81",
      "gas": 21000,
      "gasPrice": "20000000000",
      "hash": "0x525ca56bed576ed19fec8eeb984ce43ecf6809faa0f34d1f19d302de882bd25e",
      "input": "0x",
      "nonce": 27,
      "publicKey": "0x3bb51c854d362929f41988b42e3acd9fb1179efd2c71363e5df259a743c12bc016c1021caa9a04843be17055fd8b993b087b82f2b8af727c99b8b93d6816f916",
      "r": "0xba200c086aa141a6ff0154aa14c7236ceee295d2c83d44a22833230a023f8e17",
      "raw": "0xf86c1b8504a817c80082520894d4eaef1fa90267697e9a7a3d056a2a6c9e79a42288016345785d8a0000801ba0ba200c086aa141a6ff0154aa14c7236ceee295d2c83d44a22833230a023f8e17a03deda39034f9705356ef81fd76777800ceba5402ea6e0a633fda53e751e4ae54",
      "s": "0x3deda39034f9705356ef81fd76777800ceba5402ea6e0a633fda53e751e4ae54",
      "standardV": "0x0",
      "to": "0xd4eAeF1FA90267697e9A7a3D056a2A6C9E79a422",
      "transactionIndex": 4,
      "v": "0x1b",
      "value": "100000000000000000",
    }
    */
    try {
      // const subscription = this._web3.eth.subscribe('logs', {
      //     address: this.address,
      // }, function(error, result){
      //     if (!error)
      //         console.log(result);
      //     else
      //       console.log(error)
      // });
      const outgoingPastEvents = await this._contracts[account.currency].getPastEvents('Transfer', {filter: {from: this.address}}, {fromBlock: 0, toBlock: 'latest'})
      // const incomingPastEvents = await this._contracts[account.currency].getPastEvents('Transfer', {filter: {to: this.address}}, {fromBlock: 0, toBlock: 'latest'})
      // console.log("incomingPastEvents", incomingPastEvents)
      // const outgoingPastEvents = await this._contracts[account.currency].events.Transfer({filter: {to: this.address}}, {fromBlock: 0})
      // console.log("outgoingPastEvents", outgoingPastEvents)
      //
      // const incomingPastEvents = await this._contracts[account.currency].events.Transfer({filter: {to: this.address}}, {fromBlock: 0})
      // console.log("incomingPastEvents", incomingPastEvents)
      // const incomingPastEvents = await this._contracts[account.currency].events.Transfer({
      //     filter: {to: this.address}, // Using an array means OR: e.g. 20 or 23
      //     fromBlock: 0
      // })
      // console.log("incomingPastEvents", incomingPastEvents)
      // const outgoingPastEvents = this._contracts[account.currency].events.Transfer({
      //     filter: {from: this.address}, // Using an array means OR: e.g. 20 or 23
      //     fromBlock: 0
      // }, function(error, event){ console.log('callback 1: ', event); })
      // .on('data', function(event){
      //     console.log('callback 2: ', event); // same results as the optional callback above
      // })
      // .on('changed', function(event){
      //     // remove event from local database
      //     console.log('callback 3: ', event); // same results as the optional callback above
      // })
      // .on('error', console.error)
      // console.log("outgoingPastEvents", outgoingPastEvents)

      // event output example
      // > {
      //     returnValues: {
      //         myIndexedParam: 20,
      //         myOtherIndexedParam: '0x123456789...',
      //         myNonIndexParam: 'My String'
      //     },
      //     raw: {
      //         data: '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385',
      //         topics: ['0xfd43ade1c09fade1c0d57a7af66ab4ead7c2c2eb7b11a91ffdd57a7af66ab4ead7', '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385']
      //     },
      //     event: 'MyEvent',
      //     signature: '0xfd43ade1c09fade1c0d57a7af66ab4ead7c2c2eb7b11a91ffdd57a7af66ab4ead7',
      //     logIndex: 0,
      //     transactionIndex: 0,
      //     transactionHash: '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385',
      //     blockHash: '0xfd43ade1c09fade1c0d57a7af66ab4ead7c2c2eb7b11a91ffdd57a7af66ab4ead7',
      //     blockNumber: 1234,
      //     address: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe'
      // }


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