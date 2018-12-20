import { call, put, take, takeEvery } from 'redux-saga/effects'
import {
  SAVE_WALLET,
  SAVE_WALLET_INSTANCE,
  SAVE_WALLETS,
  GET_WALLET_FROM_NETWORK,
  GET_WALLETS_FROM_NETWORK,
  SAVE_WALLET_TO_DB,
  SAVE_WALLETS_TO_DB,
  GET_WALLET_FROM_DB,
  GET_WALLETS_FROM_DB,
  ADD_WALLET,
  SET_DEFAULT_WALLET, START_WALLET_INSTANCE, CREATE_WALLET, SAVE_WALLET_INSTANCE_TO_DB,
} from './actions'
import Wallet, {initialFx} from "../../system/Wallet"
import {UNSET_LOADING} from "../../actions";
import {SAVE_TRANSACTIONS} from "../WalletDetail/actions";

export function* createWallet(action) {
  const { db } = action
  const wallet = yield Wallet.generateWallet()
  yield put({
    type: SAVE_WALLET,
    wallet: wallet,
  })

  yield call(startWalletInstance, {db: db, wallet: wallet})
  yield put({
    type: UNSET_LOADING,
  })
}
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
    console.log("error1 in setDefaultWallet", e)
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
    console.log("error2 in setDefaultWallet", e)
  }
}
export function* saveWalletToDB(action) {
  let { db, wallet } = action

  yield call(() => retryUntilWritten(db, "wallet", wallet))
  yield put({
    type: SAVE_WALLET,
    wallet: wallet,
  })

}

function retryUntilWritten(db, index, data) {
  return db.get(index).then(function (origDoc) {
    return db.put({
      data: data,
      _id: index,
      _rev: origDoc._rev,
    });
  }).catch(function (err) {
    if (err.status === 409) {
      return retryUntilWritten(db, index, data);
    } else { // new doc
      return db.put({
        data: data,
        _id: index,
      });
    }
  });
}

export function* saveWalletsToDB(action) {
  // let { db, wallets } = action
  // try {
  //   const fetchResult = yield call(() => db.get('wallets'))
  //   yield call(() => db.put({
  //     _id: 'wallets',
  //     data: wallets,
  //     _rev: fetchResult._rev,
  //   }))
  // } catch (e) {
  //   console.log(e)
  //   yield call(() => db.put({
  //     _id: 'wallets',
  //     data: wallets,
  //   }))
  // }
  // console.log("wallets", wallets)
  // try {
  // yield put({
  //   type: SAVE_WALLETS,
  //   wallets: wallets,
  // })
  //   } catch (e) {
  //   console.log(e)
  // }
}


export function* getWalletFromNetwork(action) {
  let { db, iWallet } = action
  try {
    yield iWallet.fetchWalletFromNetwork()
    yield call(saveWalletInstanceToDB, {db: db, iWallet: iWallet})
  } catch (e) {
    console.log("error1 in getWalletFromNetwork", e)
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
    console.log("error1 in getWalletsFromNetwork", e)
    return false
  }

  return true
}


export function* getWalletFromDB(action) {
  let { db } = action
  try {
    const fetchResult = yield call(() => db.get('wallet'))
    console.log('fetchResult in getWalletFromDB', fetchResult)
    if (fetchResult.data) {
      let wallet = fetchResult.data
      if (wallet.fx !== undefined) {
        wallet = Object.assign({}, {fx: initialFx}, wallet)
      }
      // console.log("wallet in getWalletFromDB", wallet)
      yield put({
        type: SAVE_WALLET,
        wallet: wallet,
      })
      return wallet
    }
  } catch (e) {
  }
  const wallet = yield Wallet.generateWallet()
  yield call(saveWalletToDB, {db: db, wallet: wallet})
  return wallet
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
    console.log("error1 in getWalletsFromDB", e)
    return false
  }
  return true
}

export function* startWalletInstance(action) {
  let { db, wallet } = action
  try {
    const iWallet = new Wallet()
    console.log("iWallet.address in startWalletInstance", iWallet.address, wallet)
    yield iWallet.start(wallet)
    console.log("iWallet.address in startWalletInstance", iWallet.address)
    yield put({
      type: SAVE_WALLET_INSTANCE,
      iWallet: iWallet,
    })
    call(getWalletFromNetwork, {db: db, iWallet: iWallet})
    return iWallet
  } catch (error) {
    console.log('error in startWalletInstance', error)
    return null
  }
}

export function* saveWalletInstanceToDB(action) {
  let { db, iWallet } = action
  console.log('in saveWalletInstanceToDB', iWallet.accounts)
  try {

    const wallet = iWallet.getJson()
    yield call(saveWalletToDB, {db: db, wallet: wallet})
    yield put({
      type: SAVE_WALLET_INSTANCE,
      iWallet: iWallet,
    })
  } catch(e) {
    console.log("error in saveWalletInstanceToDB", e)
  }
}

const walletSaga = [
  takeEvery(CREATE_WALLET, createWallet),
  takeEvery(ADD_WALLET, addWallet),
  takeEvery(SET_DEFAULT_WALLET, setDefaultWallet),
  takeEvery(START_WALLET_INSTANCE, startWalletInstance),
  takeEvery(SAVE_WALLET_INSTANCE_TO_DB, saveWalletInstanceToDB),
  takeEvery(START_WALLET_INSTANCE, startWalletInstance),
  takeEvery(GET_WALLET_FROM_NETWORK, getWalletFromNetwork),
  takeEvery(GET_WALLETS_FROM_NETWORK, getWalletsFromNetwork),
  takeEvery(GET_WALLET_FROM_DB, getWalletFromDB),
  takeEvery(GET_WALLETS_FROM_DB, getWalletsFromDB),
  takeEvery(SAVE_WALLET_TO_DB, saveWalletToDB),
  takeEvery(SAVE_WALLETS_TO_DB, saveWalletsToDB),
]

export default walletSaga

