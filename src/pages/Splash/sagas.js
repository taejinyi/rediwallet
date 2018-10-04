import { put, call, select, takeEvery } from 'redux-saga/effects'

import { SPLASH_STATE, GET_INFORMATION, SAVE_SPLASH_STATE } from './actions'
import {SAVE_DEFAULT_ACCOUNT, SAVE_WALLET} from "../Wallet/actions";
import {SecureStore} from "expo";

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

  try {
    const fetchResult = yield call(() => db.get('wallet'))
    const { data } = fetchResult

    yield put({
      type: SAVE_WALLET,
      wallet: data,
    })
  } catch (error) {
    const { status } = error

    if(status === 404) {
      return false
    }
  }

  yield put({
    type: SAVE_SPLASH_STATE,
    splashState: SPLASH_STATE.STATE_FINISH
  })
}

export function* setInitialState(action) {
{
    console.log("in addAccount")
  const { db, account } = action
  const newAccountPublic = {
    [ account.address ]: {
      address: account.address,
      nonce: account.nonce,
    }
  }
  const newAccount = {
    [ account.address ]: {
      address: account.address,
      nonce: account.nonce,
      privateKey: account.privateKey,
    }
  }
  console.log(newAccountPublic)
  console.log(newAccount)

  try {
    const fetchResult = yield call(() => db.get('wallet'))
    const newDataPublic = Object.assign({}, fetchResult.data, newAccountPublic)

    yield call(() => db.put({
      _id: 'wallet',
      data: newDataPublic,
      _rev: fetchResult._rev,
    }))
    console.log(newDataPublic)
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
const splashSagas = [
  takeEvery(GET_INFORMATION, getInformation),
]

export default splashSagas
