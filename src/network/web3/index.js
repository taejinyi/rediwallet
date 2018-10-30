import { Currency } from '../../utils/crypto'
import Web3 from 'web3'
import {Alert} from "react-native";
import {SecureStore} from "expo";
import ethers from 'ethers'
import { fromHexString } from '../../utils'
import HDWalletProvider from "truffle-hdwallet-provider"
import * as loomjs from "./loom.umd";

const chainId    = 'default'
const writeUrl   = 'wss://loom.socu.io/websocket'
const readUrl    = 'wss://loom.socu.io/queryws'
const infleumAddress = '0xf337f6821b18b2eb24c44d74f3fa91128ead23f4'
const infleumContract = require('rediwallet/src/contracts/Infleum.json')

const kovanURL = "https://kovan.infura.io"
// const kovanURL = "https://kovan.infura.io/v3/5f559ee7fbf849c5a63c5a272dfe2530"

function getMnemonic() {
  return "pilot soft lottery source duty sentence exist wonder leaf same middle allow"
  // const mnemonic = "logic eyebrow ship sell artist whale fade inside sentence magnet prefer render"
}

function getWeb3() {
  const mnemonic = getMnemonic()
  const provider = new HDWalletProvider(mnemonic, kovanURL)
  const web3 = new Web3(provider);
  return web3
}

function getLoomWeb3(publicKey, privateKey) {
  const client = new loomjs.Client(
    chainId,
    writeUrl,
    readUrl,
  )
  client.txMiddleware = [
    new loomjs.NonceTxMiddleware(publicKey, client),
    new loomjs.SignedTxMiddleware(privateKey)
  ]
  return new Web3(new loomjs.LoomProvider(client, privateKey))
}

const getBalance = async (wallet) => {
  const web3 = getWeb3()

  if (wallet.currency === Currency.ETH.ticker) {
    try {
      const balance = await web3.eth.getBalance(wallet.address)
      return balance
    } catch (error) {
      console.log(error)
      return null
    }
  } else if (wallet.currency === Currency.IFUM.ticker) {
    try {
      const abi = infleumContract.abi
      const contract = new web3.eth.Contract(abi, Currency.IFUM.address)
      return await contract.methods.balanceOf(wallet.address).call({from: wallet.address})
    } catch (error) {
      console.log(error)
      return null
    }
  } else if (wallet.currency === Currency.KRWT.ticker) {
    try {
      const abi = infleumContract.abi
      const contract = new web3.eth.Contract(abi, Currency.KRWT.address)
      return await contract.methods.balanceOf(wallet.address).call({from: wallet.address})
    } catch (error) {
      console.log(error)
      return null
    }
  }
}


const send = async (wallet, toAddress, amount) => {
  console.log('in send = ', wallet, toAddress, amount)
  if (wallet.currency === Currency.ETH.ticker) {
    try {
      const web3 = getWeb3()
      const tx = await web3.eth.sendTransaction({to:toAddress, from:wallet.address, value:web3.utils.toWei(amount.toString(), "ether")})
      console.log(tx)
    } catch (error) {
      console.log(error)
      return null

    }
  } else if (wallet.currency === Currency.KRWT.ticker) {
    try {
      const privateKeyHex = await SecureStore.getItemAsync(wallet.address)
      console.log("privateKeyHex", privateKeyHex)
      const privateKey = fromHexString(privateKeyHex)
      const publicKey = loomjs.CryptoUtils.publicKeyFromPrivateKey(privateKey)
      console.log('TO SEND', privateKeyHex, privateKey, publicKey)
      const web3 = getLoomWeb3(publicKey, privateKey)
      const simpleStorageAddress = "0x5c1ce88e643fa1ca6a9ca0e35b2021c54ddf4a7b"
      const simpleStorageABI = require('../../contracts/SimpleStorage.json')
      const abi = simpleStorageABI.abi
      const contract = new web3.eth.Contract(abi, simpleStorageAddress)
      console.log('in send =, actually set ', contract.methods)
      const retM = await contract.methods.set(amount).send({from:wallet.address})
      console.log(retM)

    } catch (error) {
      console.log(error)
      return null
    }
  } else {
    try {
      const web3 = getWeb3()
      const abi = infleumContract.abi
      const contract = new web3.eth.Contract(abi, infleumAddress)
      console.log('in send = ', contract.methods)
      const retM = await contract.methods.transfer(toAddress, amount).send({from:wallet.address})
      console.log(retM)

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

