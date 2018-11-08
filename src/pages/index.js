// import { combineReducers } from 'redux'

import SplashPage from './Splash'
import LandingPage from './Landing'
import LockPage from './Lock'
import MnemonicBackupPage from './MnemonicBackup'
import MnemonicImportPage from './MnemonicImport'
import WalletPage from './Wallet'
import WalletDetailPage from './WalletDetail'
import SendPage from './Send'
import QRCodeScan from './QRCodeScan'
import SettingPage from './Setting'
import appStateReducer from '../reducers'
import splashStateReducer from './Splash/reducers'
import walletReducer from './Wallet/reducers'
import transactionsReducer from './WalletDetail/reducers'
import {
  getWalletFromNetwork,
  getWalletsFromNetwork,
  getWalletFromDB,
  getWalletsFromDB,
  saveWalletToDB,
  saveWalletsToDB,
  addWallet,
  setDefaultWallet,
} from './Wallet/actions'

import {
  saveTransactionsToDB,
  getTransactionsFromDB,
  getTransactionsFromServer,
  saveOneTransaction,
  getNextTransactionsOnlyState,
} from './WalletDetail/actions'

import { getInformation } from './Splash/actions'
import {
  saveSeed,
  saveUnlocked,
  showProcessingModal,
  hideProcessingModal,
} from '../actions'
//
// import {
//   lockWithFingerprint,
//   lockWithPinNumber
// } from './Lock/actions'
//
// import {
//   unlockWithFingerprint,
//   unlockWithPinNumber
// } from './Unlock/actions'
import walletSaga from './Wallet/sagas'
import splashSaga from './Splash/sagas'
import transactionsSaga from './WalletDetail/sagas'

// import lockSaga from './Lock/sagas'
// import unlockSaga from './Unlock/sagas'
//
// import lockStateReducer from './Lock/reducers'
// import unlockStateReducer from './Unlock/reducers'

const actions = {
  saveSeed,
  getInformation,
  saveUnlocked,
  addWallet,
  setDefaultWallet,
  getWalletFromDB,
  getWalletsFromDB,
  getWalletFromNetwork,
  getWalletsFromNetwork,
  getTransactionsFromDB,
  getTransactionsFromServer,
  saveOneTransaction,
  getNextTransactionsOnlyState,
  saveWalletToDB,
  saveWalletsToDB,
  showProcessingModal,
  hideProcessingModal,
  // lockWithFingerprint,
  // lockWithPinNumber,
  // unlockWithFingerprint,
  // unlockWithPinNumber
}

const sagas = [
    ... walletSaga,
    ... splashSaga,
    ... transactionsSaga

  // ... lockSaga,
  // ... unlockSaga,
]

const reducers = {
  splashStateReducer,
  appStateReducer,
  walletReducer,
  transactionsReducer
}
// walletReducer: walletInfoReducer,

export {
	SplashPage,
	LandingPage,
	LockPage,
  MnemonicBackupPage,
  MnemonicImportPage,
  WalletPage,
  WalletDetailPage,
  SendPage,
  QRCodeScan,
  SettingPage,

  actions,
  sagas,
  reducers,
}
