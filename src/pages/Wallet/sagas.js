import { call, put, take, takeEvery } from 'redux-saga/effects'

import {
  ADD_ACCOUNT, GENERATE_ACCOUNT,
  SAVE_DEFAULT_ACCOUNT,
  SAVE_WALLET,
  GET_WALLET_FROM_NETWORK,
  GET_ACCOUNT_FROM_NETWORK,
} from './actions'
import {SecureStore} from "expo";
import {Alert} from "react-native";
import * as network from 'rediwallet/src/network/web3'
export function* generateAccount(action) {
  const { db, currency } = action
  const strWalletIndex = yield SecureStore.getItemAsync('walletIndex')
  const mnemonic = yield SecureStore.getItemAsync('mnemonic')

  let walletIndex
  if(strWalletIndex == null) {
    walletIndex = 0
  } else {
    walletIndex = parseInt(strWalletIndex, 10) + 1
  }
  const ethers = require('ethers');
  const path = "m/44'/60'/0'/0/" + walletIndex
  const _newAccount = yield ethers.Wallet.fromMnemonic(mnemonic, path);
  const newAccount = {
    address: _newAccount.address,
    privateKey: _newAccount.privateKey,
    nonce: walletIndex,
    currency: currency
  }
  yield call(addAccount, {
    db: db,
    account: newAccount
  })
  try {
    yield SecureStore.setItemAsync('walletIndex', walletIndex.toString())
  } catch(error) {
    Alert.alert('Wallet Index Save Error', 'Failed to save the wallet index.')
  }
  return true
}
export function* addAccount(action) {
  const { db, account } = action
  const newAccountPublic = {
    [ account.address ]: {
      address: account.address,
      nonce: account.nonce,
      currency: account.currency,
      balance: 0
    }
  }
  const newAccount = {
    [ account.address ]: {
      address: account.address,
      nonce: account.nonce,
      privateKey: account.privateKey,
      currency: account.currency,
      balance: 0
    }
  }

  try {
    const fetchResult = yield call(() => db.get('wallet'))
    const newDataPublic = Object.assign({}, fetchResult.data, newAccountPublic)

    yield call(() => db.put({
      _id: 'wallet',
      data: newDataPublic,
      _rev: fetchResult._rev,
    }))
    yield put({
      type: SAVE_WALLET,
      wallet: newDataPublic,
    })
  } catch (error) {
    const { status } = error

    if(status === 404) {
      yield call(() => db.put({
        _id: 'wallet',
        data: newAccountPublic
      }))
      yield put({
        type: SAVE_WALLET,
        wallet: newAccountPublic,
      })

      yield call(() => db.put({
        _id: 'default',
        data: newAccountPublic
      }))
      yield put({
        type: SAVE_DEFAULT_ACCOUNT,
        defaultAccount: newAccountPublic,
      })
    }
  }
  yield SecureStore.setItemAsync(account.address, account.privateKey)

  return account.address
}

export function* getWalletFromNetwork(action) {
  console.log('in getWalletFromNetwork')
  const { wallet } = action
  console.log(wallet)

  const allPropertyNames = Object.keys(wallet)

  for (let j=0; j<allPropertyNames.length; j++) {
    const name = allPropertyNames[j];
    const value = wallet[name];
    yield call(() => getAccountFromNetwork({account: value}))
  }
}

export function* getAccountFromNetwork(action) {
  console.log('in getAccountFromNetwork')
  const { account } = action
  console.log(account.address, account.currency, account.nonce, account.balance)
  // const response = yield network.getBalance(account.address)

  const response = yield call(() => network.getBalance(account.address))

}

const walletSaga = [
  // takeEvery(SAVE_WALLET_TO_DB, saveWalletToDB),
  // takeEvery(GET_WALLET_FROM_DB, getWalletFromDB),
  takeEvery(GET_WALLET_FROM_NETWORK, getWalletFromNetwork),
  takeEvery(GET_ACCOUNT_FROM_NETWORK, getAccountFromNetwork),
  takeEvery(ADD_ACCOUNT, addAccount),
  takeEvery(GENERATE_ACCOUNT, generateAccount),
  // takeEvery(SAVE_WALLET, saveWallet),
]

export default walletSaga

