// import { combineReducers } from 'redux'

import SplashPage from './Splash'
import LandingPage from './Landing'
import LockPage from './Lock'
import UnlockPage from './Unlock'
import MnemonicBackupPage from './MnemonicBackup'
import WalletPage from './Wallet'
import SettingPage from './Setting'

import {
  savePinNumber,
  saveMnemonic,
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

// import lockSaga from './Lock/sagas'
// import unlockSaga from './Unlock/sagas'
//
// import lockStateReducer from './Lock/reducers'
// import unlockStateReducer from './Unlock/reducers'

const actions = {
  savePinNumber,
  saveMnemonic,
  showProcessingModal,
  hideProcessingModal,
  // lockWithFingerprint,
  // lockWithPinNumber,
  // unlockWithFingerprint,
  // unlockWithPinNumber
}
//
// const sagas = [
//   ... lockSaga,
//   ... unlockSaga,
// ]
//
// const reducers = {
//   lockStateReducer,
//   unlockStateReducer,
// }
// walletReducer: walletInfoReducer,
const sagas = []
const reducers = []

export {
	SplashPage,
	LandingPage,
	LockPage,
  UnlockPage,
  MnemonicBackupPage,
  WalletPage,
  SettingPage,

  actions,
  sagas,
  reducers,
}
