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

export function* addWallet(action) {
  const { db, wallet } = action
  console.log("in addWallet", wallet)

  try {
    const fetchResult = yield call(() => db.get('wallet'))
    console.log("in addWallet, fetchResult => ", fetchResult)
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
  console.log('in setDefaultWallet', wallet)
  try {
    const fetchResult = yield call(() => db.get('wallet'))
    console.log("in setDefaultWallet, fetchResult => ", fetchResult)
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
  console.log('in saveWalletToDB', wallet)
  try {
    const fetchResult = yield call(() => db.get('wallet'))
    console.log("in saveWalletToDB, fetchResult => ", fetchResult)
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
      balance: wallet.balance
    }
  }
  let wallets = null
  try {
    const fetchResult = yield call(() => db.get('wallets'))
    console.log("in saveWalletToDB 2, fetchResult => ", fetchResult)
    wallets = Object.assign({}, fetchResult.data, newWallet)
  } catch (e) {
    wallets = newWallet
  }
  yield put({
    type: SAVE_WALLETS_TO_DB,
    db: db,
    wallets: wallets,
  })

}

export function* saveWalletsToDB(action) {
  console.log('in saveWalletsToDB')
  let { db, wallets } = action
  console.log(wallets)
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
  console.log('in getWalletFromNetwork')
  let { db, wallet } = action
  return true
}


export function* getWalletsFromNetwork(action) {
  console.log('in getWalletsFromNetwork')
  let { db } = action
  try {
    const fetchResult = yield call(() => db.get('wallets'))
    const addresses = Object.keys(fetchResult.data)
    let i
    let wallets = fetchResult.data
    console.log('in getWalletsFromNetwork wallets:', wallets)
    for (i = 0; i < addresses.length; i++) {
      const balance = yield network.getBalance(wallets[addresses[i]])
      const updatedWallet = {
        [addresses[i]]  : {
          'address': addresses[i],
          'nonce': fetchResult.data[addresses[i]].nonce,
          'currency': fetchResult.data[addresses[i]].currency,
          'balance': balance
        }
      }
      wallets = Object.assign({}, wallets, updatedWallet)
    }
    yield put({
      type: SAVE_WALLETS_TO_DB,
      db: db,
      wallets: wallets,
    })
  } catch (e) {
    console.log(e)
    return false
  }

  return true
}


export function* getWalletFromDB(action) {
  console.log('in getWalletFromDB')
  let { db, wallet } = action
  try {
    const fetchResult = yield call(() => db.get('wallets'))
    const data = fetchResult.data[wallet.address]
    if (data) {
      yield put({
        type: SAVE_WALLET,
        wallet: data,
      })
    }
  } catch (e) {
    console.log(e)
    return false
  }
  return true
}


export function* getWalletsFromDB(action) {
  console.log('in getWalletsFromDB')
  let { db } = action
  try {
    const fetchResult = yield call(() => db.get('wallets'))
    console.log('in getWalletsFromDB', fetchResult.data)
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
  takeEvery(SAVE_WALLETS_TO_DB, saveWalletsToDB)
]

export default walletSaga

