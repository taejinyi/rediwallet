import { call, put, take, takeEvery } from 'redux-saga/effects'
import {
  SAVE_WALLET,
  SAVE_WALLETS,
  GET_WALLET_FROM_NETWORK,
  GET_WALLETS_FROM_NETWORK,
  SAVE_WALLET_TO_DB,
  SAVE_WALLETS_TO_DB,
  GET_WALLET_FROM_DB,
  GET_WALLETS_FROM_DB,
  ADD_WALLET,
  SET_DEFAULT_WALLET,
} from './actions'
import * as network from 'rediwallet/src/network/web3'
import Wallet from "../../system/Wallet"

export function* addWallet(action) {
  const { db, wallet } = action

  try {
    const fetchResult = yield call(() => db.get('wallet'))
    yield put({
      type: SAVE_WALLET_TO_DB,
      db: db,
      wallet: wallet,
    })
  } catch (e) {
    yield put({
      type: SET_DEFAULT_WALLET,
      db: db,
      wallet: wallet,
    })
  }
}

export function* setDefaultWallet(action) {
  const { db, wallet } = action
  try {
    const fetchResult = yield call(() => db.get('wallet'))
    yield call(() => db.put({
      _id: 'wallet',
      data: wallet,
      _rev: fetchResult._rev,
    }))
  } catch (e) {
    console.log(e)
    yield call(() => db.put({
      _id: 'wallet',
      data: wallet,
    }))
  }

  try {
    yield put({
      type: SAVE_WALLET_TO_DB,
      db: db,
      wallet: wallet,
    })
  } catch (e) {
    console.log(e)
  }
}

export function* saveWalletToDB(action) {
  let { db, wallet } = action
  try {
    const fetchResult = yield call(() => db.get('wallet'))
    if (fetchResult.data.address === wallet.address) {
      yield call(() => db.put({
        _id: 'wallet',
        data: wallet,
        _rev: fetchResult._rev,
      }))
      yield put({
        type: SAVE_WALLET,
        wallet: wallet,
      })
    }
  } catch (e) {
    yield call(() => db.put({
      _id: 'wallet',
      data: wallet,
    }))
    yield put({
      type: SAVE_WALLET,
      wallet: wallet,
    })
  }
  const newWallet = {
    [wallet.address]: {
      address: wallet.address,
      nonce: wallet.nonce,
      currency: wallet.currency,
      accounts: wallet.accounts
    }
  }
  let wallets = null
  try {
    const fetchResult = yield call(() => db.get('wallets'))
    wallets = Object.assign({}, fetchResult.data, newWallet)
  } catch (e) {
    wallets = newWallet
  }
  yield call(saveWalletsToDB, {db: db, wallets: wallets})
}

export function* saveWalletsToDB(action) {
  let { db, wallets } = action
  try {
    const fetchResult = yield call(() => db.get('wallets'))
    yield call(() => db.put({
      _id: 'wallets',
      data: wallets,
      _rev: fetchResult._rev,
    }))
  } catch (e) {
    console.log(e)
    yield call(() => db.put({
      _id: 'wallets',
      data: wallets,
    }))
  }
  yield put({
    type: SAVE_WALLETS,
    wallets: wallets,
  })
}


export function* getWalletFromNetwork(action) {
  let { db, wallet } = action
  try {
    const _wallet = new Wallet()
    yield _wallet.start(wallet)
    yield _wallet.getFromNetwork()
    const newWallet = _wallet.getJson()
    yield call(saveWalletToDB, {db: db, wallet: newWallet})
  } catch (e) {
    console.log(e)
  }
  return true
}


export function* getWalletsFromNetwork(action) {
  let { db } = action
  try {
    const fetchResult = yield call(() => db.get('wallets'))
    const addresses = Object.keys(fetchResult.data)
    let i
    let wallets = fetchResult.data
    for (i = 0; i < addresses.length; i++) {
      yield call(getWalletFromNetwork, {db: db, wallet: wallets[addresses[i]]})
    }
  } catch (e) {
    console.log(e)
    return false
  }

  return true
}


export function* getWalletFromDB(action) {
  let { db } = action
  try {
    const fetchResult = yield call(() => db.get('wallet'))
    if (fetchResult.data) {
      yield put({
        type: SAVE_WALLET,
        wallet: fetchResult.data,
      })
    }
  } catch (e) {
    console.log(e)
    return false
  }
  return true
}


export function* getWalletsFromDB(action) {
  let { db } = action
  try {
    const fetchResult = yield call(() => db.get('wallets'))
    yield put({
      type: SAVE_WALLETS,
      wallets: fetchResult.data,
    })
  } catch (e) {
    console.log(e)
    return false
  }
  return true
}


const walletSaga = [
  takeEvery(ADD_WALLET, addWallet),
  takeEvery(SET_DEFAULT_WALLET, setDefaultWallet),
  takeEvery(GET_WALLET_FROM_NETWORK, getWalletFromNetwork),
  takeEvery(GET_WALLETS_FROM_NETWORK, getWalletsFromNetwork),
  takeEvery(GET_WALLET_FROM_DB, getWalletFromDB),
  takeEvery(GET_WALLETS_FROM_DB, getWalletsFromDB),
  takeEvery(SAVE_WALLET_TO_DB, saveWalletToDB),
  takeEvery(SAVE_WALLETS_TO_DB, saveWalletsToDB),
]

export default walletSaga

