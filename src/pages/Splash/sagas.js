import { put, call, select, takeEvery } from 'redux-saga/effects'

import { SPLASH_STATE, GET_INFORMATION, SAVE_SPLASH_STATE } from './actions'
import {SAVE_DEFAULT_ACCOUNT, SAVE_WALLET, ADD_ACCOUNT} from "../Wallet/actions";
import {SecureStore} from "expo";

import {addAccount, generateAccount} from "../Wallet/sagas";
import {actions} from "../index";
import {saveProfileInformationToDB} from "../AccountDetail/sagas";

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
  console.log("in getInformation")
  const { db } = action

  try {
    const fetchResult = yield call(() => db.get('wallet'))
    const { data } = fetchResult
    console.log(data)
    yield put({
      type: SAVE_WALLET,
      wallet: data,
    })
  } catch (error) {
    const { status } = error
    // console.log(error)
    console.log(status)
    if(status === 404) {
      yield call(generateAccount, {db: db, currency: "ETH"})
      yield call(generateAccount, {db: db, currency: "IFUM"})
      yield call(generateAccount, {db: db, currency: "KRWT"})
    }
  }
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
