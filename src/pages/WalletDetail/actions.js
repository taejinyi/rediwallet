export const SAVE_TRANSACTIONS = 'SAVE_TRANSACTIONS'
export const SAVE_PAGE_STATE = 'SAVE_PAGE_STATE'
export const SAVE_END_REACHED = 'SAVE_END_REACHED'
export const SAVE_RECENT_NOT_UPDATED = 'SAVE_RECENT_NOT_UPDATED'
export const SAVE_REFRESHING = 'SAVE_REFRESHING'

export const SAVE_TRANSACTIONS_TO_DB = 'SAVE_TRANSACTIONS_TO_DB'
export const GET_TRANSACTIONS_FROM_DB = 'GET_TRANSACTIONS_FROM_DB'
export const GET_TRANSACTIONS_FROM_NETWORK = 'GET_TRANSACTIONS_FROM_NETWORK'
export const GET_TRANSACTION_FROM_NETWORK = 'GET_TRANSACTION_FROM_NETWORK'
export const SAVE_ONE_TRANSACTION = 'SAVE_ONE_TRANSACTION'

export const PAGE_STATE = {
  STATE_LOADING: 'STATE_LOADING',
  STATE_LOADING_FAILED: 'STATE_LOADING_FAILED',
  STATE_LOADING_FINISH: 'STATE_LOADING_FINISH',
  STATE_LOADING_NEXT: 'STATE_LOADING_NEXT',
  STATE_LOADING_NEXT_FINISH: 'STATE_LOADING_NEXT_FINISH',
  STATE_LOADING_COMPLETE: 'STATE_LOADING_COMPLETE'
}

export const savePageState = (pageState) => ({
  type: SAVE_PAGE_STATE,
  pageState,
})

export const saveRefreshing = (refreshing) => ({
  type: SAVE_REFRESHING,
  refreshing,
})

export const saveRecentNotUpdated = (recentNotUpdated) => ({
  type: SAVE_RECENT_NOT_UPDATED,
  recentNotUpdated,
})

export const saveEndReached = (endReached) => ({
  type: SAVE_END_REACHED,
  endReached,
})

export const saveTransactions = (transactions) => ({
  type: SAVE_TRANSACTIONS,
  transactions,
})

export const saveTransactionsToDB = (db, network, token, transactions) => ({
  db: db,
  network: network,
  token: token,
  transactions: transactions,
  type: SAVE_TRANSACTIONS_TO_DB,
})

export const getTransactionsFromDB = (db, network, token) => ({
  db: db,
  network: network,
  token: token,
  type: GET_TRANSACTIONS_FROM_DB,
})

export const getTransactionsFromNetwork = (iWallet, account, page, offset) => ({
  iWallet: iWallet,
  account: account,
  page: page,
  offset: offset,
  type: GET_TRANSACTIONS_FROM_NETWORK,
})

export const getTransactionFromNetwork = (db, iWallet, transactionHash) => ({
  db: db,
  iWallet: iWallet,
  transactionHash: transactionHash,
  type: GET_TRANSACTION_FROM_NETWORK,
})

export const saveOneTransaction = (transaction) => ({
  transaction: transaction,
  type: SAVE_ONE_TRANSACTION,
})

