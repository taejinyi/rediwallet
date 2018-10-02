import { SAVE_WALLETS } from './actions'

const walletReducer = (state = {}, action) => {
  switch(action.type) {
    case SAVE_WALLETS:
      return Object.assign({}, state, {
        wallets: action.wallets,
      })
    default:
      return state
  }
}

export default walletReducer
