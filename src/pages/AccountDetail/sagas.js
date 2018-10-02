import { delay } from 'redux-saga'
import { call, put, take, takeEvery } from 'redux-saga/effects'

// import * as services from 'src/apis/network'
import {
  SAVE_MY_PROFILE,
  SAVE_WALLET_INFORMATION,
  SAVE_WALLET_INFORMATION_TO_DB,
  GET_WALLET_INFORMATION_FROM_DB,
  GET_WALLET_INFORMATION_FROM_SERVER,
  GET_PROFILE_INFORMATION_FROM_DB,
  GET_PROFILE_INFORMATION_FROM_SERVER,
  SAVE_PROFILE_INFORMATION_TO_DB,
} from './actions'

export function* saveWalletInformationToDB(action) {
  const { db, wallet_info } = action

  try {
    const fetchResult = yield call(() => db.get('wallet_info'))
    const newWalletInfo = Object.assign({}, fetchResult.data, wallet_info)

    yield call(() => db.put({
      _id: 'wallet_info',
      data: newWalletInfo,
      _rev: fetchResult._rev,
    }))

    yield put({
      type: SAVE_WALLET_INFORMATION,
      wallet_info: newWalletInfo,
    })
  } catch (error) {
    const { status } = error

    if(status === 404) {
      try {
        yield call(() => db.put({
          _id: 'wallet_info',
          data: wallet_info,
        }))
      } catch (error) {
      }

      yield put({
        type: SAVE_WALLET_INFORMATION,
        wallet_info: wallet_info,
      })
    }
  }
}

export function* getWalletInformationFromDB(action) {
  const { db } = action

  try {
    const fetchResult = yield call(() => db.get('wallet_info'))
    const { data } = fetchResult

    yield put({
      type: SAVE_WALLET_INFORMATION,
      wallet_info: data,
    })
  } catch (error) {
    const { status } = error

    if(status === 404) {
      return false
    }
  }
}

export function* getWalletInformationFromServer(action) {
  const { db, token } = action

  const response = yield call(() => services.getWalletInformation(token))

  if(response && response.status === 200) {
    const { wallet } = response.data

    yield call(saveWalletInformationToDB, {
      db: db,
      wallet_info: wallet
    })
  }
}

export function* getProfileInformationFromDB(action) {
  const { db } = action

  try {
    const fetchResult = yield call(() => db.get('profile'))

    yield put({
      profile: fetchResult.data,
      type: SAVE_MY_PROFILE,
    })

  } catch (error) {
    return false
  }
}

export function* saveProfileInformationToDB(action) {
  const { db, profile, } = action

  try {
    const fetchResult = yield call(() => db.get('profile'))

    yield call(() => db.put({
      _id: 'profile',
      _rev: fetchResult._rev,
      data: profile,
    }))

    yield put({
      type: SAVE_MY_PROFILE,
      profile: profile,
    })

  } catch (error) {
    const { status } = error

    if(status === 404) {
      yield call(() => db.put({
        _id: 'profile',
        data: profile,
      }))

      yield put({
        type: SAVE_MY_PROFILE,
        profile: profile,
      })
    }
  }
}

export function* getProfileInformationFromServer(action) {
  const { db, token } = action

  const response = yield call(() => services.getMyProfile(token))

  if(response && response.status === 200) {
    const { my_profile } = response.data

    yield call(saveProfileInformationToDB, {
      db: db,
      profile: my_profile
    })
  }
}

const walletSagas = [
  takeEvery(SAVE_WALLET_INFORMATION_TO_DB, saveWalletInformationToDB),
  takeEvery(GET_WALLET_INFORMATION_FROM_DB, getWalletInformationFromDB),
  takeEvery(GET_WALLET_INFORMATION_FROM_SERVER, getWalletInformationFromServer),

  takeEvery(GET_PROFILE_INFORMATION_FROM_DB, getProfileInformationFromDB),
  takeEvery(GET_PROFILE_INFORMATION_FROM_SERVER, getProfileInformationFromServer),
  takeEvery(SAVE_PROFILE_INFORMATION_TO_DB, saveProfileInformationToDB),
]

export default walletSagas
