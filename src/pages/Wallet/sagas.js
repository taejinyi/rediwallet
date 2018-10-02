import { call, put, take, takeEvery } from 'redux-saga/effects'

import * as services from 'src/apis/network'

import {
  SAVE_WALLETS,
  SAVE_WALLETS_TO_DB,
  GET_WALLETS_FROM_DB,
  GET_WALLETS_FROM_SERVER,
  ADD_ACCOUNT,
} from './actions'

export function* saveWalletsToDB(action) {
  const { db, wallets } = action

  try {
    const fetchResult = yield call(() => db.get('wallets'))
    const newData = Object.assign({}, fetchResult.data, wallets)

    yield call(() => db.put({
      _id: 'wallets',
      data: newData,
      _rev: fetchResult._rev,
    }))

    yield put({
      type: SAVE_WALLETS,
      wallets: newData,
    })

  } catch (error) {
    const { status } = error

    if(status === 404) {
      yield call(() => db.put({
        _id: 'wallets',
        data: wallets
      }))

      yield put({
        type: SAVE_WALLETS,
        wallets: wallets,
      })
    }
  }
}

export function* getWalletsFromDB(action) {
  const { db } = action

  try {
    const fetchResult = yield call(() => db.get('wallets'))
    const { data } = fetchResult

    yield put({
      type: SAVE_WALLETS,
      wallets: data
    })
  } catch (error) {
    return false
  }
}

export function* addAccount(action) {
  const { db, wallet } = action


  // const response = yield call(() => services.createUnion(token, unionName, unionColor))
  //
  // if(response && response.status === 200) {
  const { address, ... rest } = wallet

  const newWallet = {
    [ wallet.address ]: {
      address: address,
      ... rest,
    }
  }

  yield call(saveWalletsToDB, {
    db: db,
    wallets: newWallet,
  })

  return wallet.address
  // }
}

const walletSaga = [
  takeEvery(SAVE_WALLETS_TO_DB, saveWalletsToDB),
  takeEvery(GET_WALLETS_FROM_DB, getWalletsFromDB),
  takeEvery(ADD_ACCOUNT, addAccount),
]

export default walletSaga
