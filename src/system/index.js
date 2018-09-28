
import withDB from './WithDB'
import withLock from './WithLock'

// import Watcher from './Watcher'
// import Notice from './Notice'

import NotificationSystem from './NotificationSystem'
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


  NotificationSystem,

  reducers,
  actions,
}
  // Watcher,
  // Notice,
