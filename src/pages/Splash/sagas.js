import { put, call, select, takeEvery } from 'redux-saga/effects'

import { SPLASH_STATE, GET_INFORMATION, SAVE_SPLASH_STATE } from './actions'
import {SAVE_DEFAULT_ACCOUNT, SAVE_WALLET, ADD_ACCOUNT} from "../Wallet/actions";
import {SecureStore} from "expo";

import {addAccount, generateAccount, getWalletFromNetwork} from "../Wallet/sagas";
import {actions} from "../index";

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
