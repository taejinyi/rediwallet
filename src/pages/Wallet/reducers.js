import {
  ADD_WALLET,
  SET_DEFAULT_WALLET,
  GET_WALLET_FROM_NETWORK,
  GET_WALLETS_FROM_NETWORK,
  SAVE_WALLET,
  SAVE_WALLETS,
  SAVE_WALLET_TO_DB,
  SAVE_WALLETS_TO_DB,
  GET_WALLET_FROM_DB,
  GET_WALLETS_FROM_DB,
  GET_TRANSACTIONS_FROM_DB,
  SAVE_TRANSACTIONS_TO_DB,
  SAVE_TRANSACTIONS,
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
    case SAVE_WALLET:
      return Object.assign({}, state, {
        wallet: action.wallet,
      })
    case SAVE_WALLETS:
      return Object.assign({}, state, {
        wallets: action.wallets,
      })
    case SAVE_WALLET_TO_DB:
      return Object.assign({}, state, {
        db: action.db,
        wallet: action.wallet,
      })
    case SAVE_WALLETS_TO_DB:
      return Object.assign({}, state, {
        db: action.db,
        wallets: action.wallets,
      })
    case GET_WALLET_FROM_NETWORK:
      return Object.assign({}, state, {
        db: action.db,
        wallet: action.wallet,
      })
    case GET_WALLETS_FROM_NETWORK:
      return Object.assign({}, state, {
        db: action.db,
      })
    case GET_WALLET_FROM_DB:
      return Object.assign({}, state, {
        db: action.db,
        wallet: action.wallet,
      })
    case GET_WALLETS_FROM_DB:
      return Object.assign({}, state, {
        db: action.db,
      })
    default:
      return state
  }
}

export default walletReducer
