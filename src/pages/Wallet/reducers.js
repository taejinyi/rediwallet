import {
  ADD_WALLET,
  SET_DEFAULT_WALLET,
  GET_WALLET_FROM_NETWORK,
  SAVE_DEFAULT_ACCOUNT,
  SAVE_WALLET,
} from './actions'

const walletReducer = (state = {}, action) => {
  switch(action.type) {
    case ADD_WALLET:
      return Object.assign({}, state, {
        db: action.db,
        wallet: action.wallet,
      })
    case SET_DEFAULT_WALLET:
      return Object.assign({}, state, {
        db: action.db,
        wallet: action.wallet,
      })
    case GET_WALLET_FROM_NETWORK:
      return Object.assign({}, state, {
        db: action.db,
        wallet: action.wallet,
      })
    case SAVE_WALLET:
      return Object.assign({}, state, {
        wallet: action.wallet,
      })
    default:
      return state
  }
}

export default walletReducer
