import { call, put, take, takeEvery } from 'redux-saga/effects'

import {
  ADD_ACCOUNT,
  SAVE_DEFAULT_ACCOUNT,
  SAVE_WALLET,
} from './actions'
import {SecureStore} from "expo";
//
// export function* saveWalletsToDB(action) {
//   const { db, wallets } = action
//
//   try {
//     const fetchResult = yield call(() => db.get('wallets'))
//     const newData = Object.assign({}, fetchResult.data, wallets)
//
//     yield call(() => db.put({
//       _id: 'wallets',
//       data: newData,
//       _rev: fetchResult._rev,
//     }))
//
//     yield put({
//       type: SAVE_WALLETS,
//       wallets: newData,
//     })
//
//   } catch (error) {
//     const { status } = error
//
//     if(status === 404) {
//       yield call(() => db.put({
//         _id: 'wallets',
//         data: wallets
//       }))
//
//       yield put({
//         type: SAVE_WALLETS,
//         wallets: wallets,
//       })
//     }
//   }
// }
//
// export function* getWalletsFromDB(action) {
//   const { db } = action
//
//   try {
//     const fetchResult = yield call(() => db.get('wallets'))
//     const { data } = fetchResult
//
//     yield put({
//       type: SAVE_WALLETS,
//       wallets: data
//     })
//   } catch (error) {
//     return false
//   }
// }

export function* addAccount(action) {
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

const walletSaga = [
  // takeEvery(SAVE_WALLETS_TO_DB, saveWalletsToDB),
  // takeEvery(GET_WALLETS_FROM_DB, getWalletsFromDB),
  takeEvery(ADD_ACCOUNT, addAccount),
  // takeEvery(SAVE_WALLET, saveWallet),
]

export default walletSaga

