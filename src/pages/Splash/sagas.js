import { put, call, select, takeEvery } from 'redux-saga/effects'

import { SPLASH_STATE, GET_INFORMATION, SAVE_SPLASH_STATE } from './actions'

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
  // const { db, mnemonic } = action

  yield put({
    type: SAVE_SPLASH_STATE,
    splashState: SPLASH_STATE.STATE_FINISH
  })
}


const splashSagas = [
  takeEvery(GET_INFORMATION, getInformation),
]

export default splashSagas
