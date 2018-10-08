import {ADD_ACCOUNT, GENERATE_ACCOUNT, SAVE_DEFAULT_ACCOUNT, SAVE_WALLET} from './actions'

const walletReducer = (state = {}, action) => {
  switch(action.type) {
    case GENERATE_ACCOUNT:
      return Object.assign({}, state, {
        db: action.db,
        currency: action.currency,
      })
    case ADD_ACCOUNT:
      return Object.assign({}, state, {
        db: action.db,
        account: action.account,
      })
    case SAVE_WALLET:
      return Object.assign({}, state, {
        wallet: action.wallet,
      })
    case SAVE_DEFAULT_ACCOUNT:
      return Object.assign({}, state, {
        defaultAccount: action.account,
      })
    default:
      return state
  }
}

export default walletReducer
