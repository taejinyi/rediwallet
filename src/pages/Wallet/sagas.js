import { call, put, take, takeEvery } from 'redux-saga/effects'
import {
  ADD_ACCOUNT, GENERATE_ACCOUNT,
  SAVE_DEFAULT_ACCOUNT,
  SAVE_WALLET,
  GET_WALLET_FROM_NETWORK,
  GET_ACCOUNT_FROM_NETWORK, SAVE_WALLET_TO_DB, ADD_WALLET, SET_DEFAULT_WALLET,
} from './actions'
import {SecureStore} from "expo";
import {Alert} from "react-native";
import * as network from 'rediwallet/src/network/web3'


export function* addWallet(action) {
  const { db, wallet } = action
  console.log("in addWallet", wallet)
  try {
    const fetchResult = yield call(() => db.get('wallet'))
    console.log("in addWallet, fetchResult => ", fetchResult)
  } catch (e) {
    yield put({
      type: SET_DEFAULT_WALLET,
      db: db,
      wallet: wallet,
    })
  }

  try {
    const fetchResult = yield call(() => db.get('wallets'))
    console.log("in addWallet 2, fetchResult => ", fetchResult)
    const newWallet = {
      [wallet.address]: {
        address: wallet.address,
        nonce: wallet.nonce,
        currency: wallet.currency,
        balance: wallet.balance
      }
    }
    const newData = Object.assign({}, fetchResult.data, newWallet)
    yield call(() => db.put({
      _id: 'wallets',
      data: newData,
      _rev: fetchResult._rev,
    }))
  } catch (e) {
    console.log(e)
    const newData = {
      [wallet.address]: {
        address: wallet.address,
        nonce: wallet.nonce,
        currency: wallet.currency,
        balance: wallet.balance
      }
    }

    yield call(() => db.put({
      _id: 'wallets',
      data: newData,
    }))

  }
}
export function* setDefaultWallet(action) {
  const { db, wallet } = action
  console.log('in setDefaultWallet', wallet)
}
export function* getWalletFromNetwork(action) {
  console.log('in getWalletFromNetwork')
  let { db } = action
  const response = yield call(() => network.getBalance())
  console.log("balance => ", response)

  // yield put({
  //   type: SAVE_WALLET,
  //   wallet: wallet,
  // })
  // yield call(() => db.put({
  //   _id: 'wallet',
  //   data: wallet
  // }))
  return true
}

export function* saveWalletToDB(action) {
  console.log('in saveWalletToDB')
  let { wallet } = action
  console.log(wallet)

  yield put({
    type: SAVE_WALLET,
    wallet: wallet,
  })
}

const walletSaga = [
  // takeEvery(GET_WALLET_FROM_DB, getWalletFromDB),
  takeEvery(ADD_WALLET, addWallet),
  takeEvery(SET_DEFAULT_WALLET, setDefaultWallet),
  takeEvery(GET_WALLET_FROM_NETWORK, getWalletFromNetwork),
  takeEvery(SAVE_WALLET_TO_DB, saveWalletToDB)
  // takeEvery(SAVE_WALLET, saveWallet),
]

export default walletSaga

