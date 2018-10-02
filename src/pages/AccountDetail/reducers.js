import { SAVE_WALLET_INFORMATION } from './actions'

const walletInfoReducer = (state = {}, action) => {
  switch(action.type) {
    case SAVE_WALLET_INFORMATION:
      return Object.assign({}, state, {
        wallet_info: Object.assign({}, state.wallet_info, action.wallet_info)
      })
    default:
      return state
  }
}

export default walletInfoReducer
