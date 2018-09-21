import { SAVE_PIN_NUMBER, SAVE_MNEMONIC, SHOW_PROCESSING_MODAL, HIDE_PROCESSING_MODAL } from './actions'

const appStateReducer = (state = {}, action) => {
  switch(action.type) {
    case SHOW_PROCESSING_MODAL:
      return Object.assign({}, state, {
        isShow: true,
        message: action.message,
      })
    case HIDE_PROCESSING_MODAL:
      return Object.assign({}, state, {
        isShow: false,
      })
    case SAVE_PIN_NUMBER:
      return Object.assign({}, state, {
        pinNumber: action.pinNumber
      })
    case SAVE_MNEMONIC:
      return Object.assign({}, state, {
        mnemonic: action.mnemonic
      })
    default:
      return state
  }
}

export default appStateReducer
