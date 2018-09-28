import { REGISTER_NOTIFICATION_SYSTEM } from './actions'

const initialState = {
  notificationSystem: null,
}

export const notificationReducer = (state = initialState, action) => {
  switch(action.type) {
    case REGISTER_NOTIFICATION_SYSTEM:
      return Object.assign({}, state, {
        notificationSystem: action.notificationSystem
      })
    default:
      return state
  }
}
