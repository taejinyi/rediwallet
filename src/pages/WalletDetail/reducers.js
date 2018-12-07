import {
  SAVE_TRANSACTIONS,
  SAVE_PAGE_STATE,
  PAGE_STATE,
  SAVE_END_REACHED,
  SAVE_RECENT_NOT_UPDATED,
  SAVE_REFRESHING
} from './actions'

const initialState = {
  pageState: PAGE_STATE.STATE_LOADING,
  refreshing: false,
  endReached: false,
  recentNotUpdated: false,
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
    case SAVE_REFRESHING:
      return Object.assign({}, state, {
        refreshing: action.refreshing,
      })
    case SAVE_END_REACHED:
      return Object.assign({}, state, {
        endReached: action.endReached,
      })
    case SAVE_RECENT_NOT_UPDATED:
      return Object.assign({}, state, {
        recentNotUpdated: action.recentNotUpdated,
      })
    default:
      return state
  }
}

export default transactionsReducer
