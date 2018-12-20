// import { combineReducers } from 'redux'

import SplashPage from './Splash'
import LandingPage from './Landing'
import LockPage from './Lock'
import PrivateKeyBackupPage from './PrivateKeyBackup'
import MnemonicBackupPage from './MnemonicBackup'
import MnemonicBackupVerificationPage from './MnemonicBackupVerification'
import ChangePinNumberPage from './ChangePinNumber'
import MnemonicImportPage from './MnemonicImport'
import WalletPage from './Wallet'
import WalletDetailPage from './WalletDetail'
import SendPage from './Send'
import QRCodeScan from './QRCodeScan'
import SettingPage from './Setting'
import WalletChangeCurrency from './WalletChangeCurrency'
import NetworkSettingPage from './NetworkSetting'
import ChangeNetworkPage from './ChangeNetwork'
import appStateReducer from '../reducers'
import splashStateReducer from './Splash/reducers'
import walletReducer from './Wallet/reducers'
import transactionsReducer from './WalletDetail/reducers'
import {
  createWallet,
  startWalletInstance,
  getWalletFromNetwork,
  getWalletsFromNetwork,
  getWalletFromDB,
  getWalletsFromDB,
  saveWalletInstance,
  saveWalletInstanceToDB,
  saveWalletToDB,
  saveWalletsToDB,
  addWallet,
  setDefaultWallet,
} from './Wallet/actions'

import {
  getTransactionFromNetwork,
  getTransactionsFromNetwork,
  saveTransactions,
  saveOneTransaction,
  saveTransactionsToDB,
  getTransactionsFromDB,
  savePageState,
  saveEndReached,
  saveRefreshing,
  saveRecentNotUpdated,
} from './WalletDetail/actions'

import { getInformation } from './Splash/actions'
import {
  saveCountry,
  setLoading,
  unsetLoading,
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
  saveCountry,
  setLoading,
  unsetLoading,
  saveSeed,
  getInformation,
  saveUnlocked,
  createWallet,
  addWallet,
  setDefaultWallet,
  getWalletFromDB,
  getWalletsFromDB,
  startWalletInstance,
  getWalletFromNetwork,
  getWalletsFromNetwork,

  getTransactionFromNetwork,
  getTransactionsFromNetwork,
  saveTransactions,
  saveOneTransaction,
  saveTransactionsToDB,
  getTransactionsFromDB,
  saveEndReached,
  saveRefreshing,
  saveRecentNotUpdated,
  savePageState,

  saveWalletToDB,
  saveWalletInstance,
  saveWalletInstanceToDB,
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
  PrivateKeyBackupPage,
  MnemonicBackupPage,
  MnemonicBackupVerificationPage,
  ChangePinNumberPage,
  MnemonicImportPage,
  WalletPage,
  WalletDetailPage,
  SendPage,
  QRCodeScan,
  SettingPage,
  WalletChangeCurrency,
  NetworkSettingPage,
  ChangeNetworkPage,
  actions,
  sagas,
  reducers,
}
