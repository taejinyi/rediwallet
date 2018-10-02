
import withDB from './WithDB'
import withLock from './WithLock'
import withWallet from './WithWallet'

// import Watcher from './Watcher'
import NotificationSystem from './NotificationSystem'
import Notice from './Notice'
import { notificationReducer } from './NotificationSystem/reducers'
import { registerNotificationSystem } from './NotificationSystem/actions'

import { AppNavigator } from './AppNavigator'

const actions = {
  registerNotificationSystem,
}

const reducers = {
  notificationSystem: notificationReducer,
}

export {
  AppNavigator,

  withDB,
  withLock,
  withWallet,

  // Watcher,
  NotificationSystem,
  Notice,

  reducers,
  actions,
}

  // Notice,
