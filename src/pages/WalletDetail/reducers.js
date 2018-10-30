import {SAVE_TRANSACTIONS, SAVE_PAGE_STATE, PAGE_STATE, GET_TRANSACTIONS_FROM_SERVER,} from './actions'

const initialState = {
  pageState: PAGE_STATE.STATE_LOADING,
}

const transactionsReducer = (state = initialState, action) => {
  switch(action.type) {
    case SAVE_TRANSACTIONS:
      return Object.assign({}, state, {
        transactions: action.transactions,
      })
    case SAVE_PAGE_STATE:
      return Object.assign({}, state, {
        pageState: action.pageState,
      })
    case GET_TRANSACTIONS_FROM_SERVER:
      return Object.assign({}, state, {
        db: action.db,
        wallet: action.wallet,
        account: action.account
      })
    default:
      return state
  }
}

export default transactionsReducer
