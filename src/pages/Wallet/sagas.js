import { call, put, take, takeEvery } from 'redux-saga/effects'
import {
  ADD_ACCOUNT, GENERATE_ACCOUNT,
  SAVE_DEFAULT_ACCOUNT,
  SAVE_WALLET,
  GET_WALLET_FROM_NETWORK,
  GET_ACCOUNT_FROM_NETWORK, SAVE_WALLET_TO_DB,
} from './actions'
import {SecureStore} from "expo";
import {Alert} from "react-native";
import * as network from 'rediwallet/src/network/web3'


export function* generateWallet(action) {
  return true
}

export function* getWalletFromNetwork(action) {
  console.log('in getWalletFromNetwork')
  let { db } = action
  const response = yield call(() => network.getBalance(0))

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
  takeEvery(GET_WALLET_FROM_NETWORK, getWalletFromNetwork),
  takeEvery(SAVE_WALLET_TO_DB, saveWalletToDB)
  // takeEvery(SAVE_WALLET, saveWallet),
]

export default walletSaga

