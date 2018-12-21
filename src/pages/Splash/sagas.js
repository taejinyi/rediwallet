import { put, call, select, takeEvery } from 'redux-saga/effects'

import { SPLASH_STATE, GET_INFORMATION, SAVE_SPLASH_STATE } from './actions'
import {SAVE_DEFAULT_ACCOUNT, SAVE_WALLET, ADD_ACCOUNT, SAVE_WALLET_INSTANCE} from "../Wallet/actions";
import {SecureStore} from "expo";

import {
  addAccount,
  generateAccount,
  startWalletInstance,
  getWalletFromNetwork,
  saveWalletToDB,
  getWalletFromDB
} from "../Wallet/sagas";
import {actions} from "../index";
import Wallet from "../../system/Wallet";

// import { getUnionsFromServer, getUnionsFromDB } from '../Unions/sagas'
// import { getPayablesFromServer, getPayablesFromDB } from '../Repay/sagas'
// import { getContactsFromDB, addContacts } from '../Contacts/sagas'
// import {
//   getWalletInformationFromServer,
//   getWalletInformationFromDB,
//   getProfileInformationFromDB,
//   getProfileInformationFromServer,
// } from '../Wallet/sagas'

export function* getInformation(action) {
  const { db } = action

  const wallet = yield call(getWalletFromDB, {db: db})
  const iWallet = yield call(startWalletInstance, {db: db, wallet: wallet})
  call(getWalletFromNetwork, {iWallet: iWallet})

  yield put({
    type: SAVE_SPLASH_STATE,
    splashState: SPLASH_STATE.STATE_FINISH
  })
  return true
}

const splashSaga = [
  takeEvery(GET_INFORMATION, getInformation),
]

export default splashSaga
