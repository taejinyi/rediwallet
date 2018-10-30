export const SAVE_TRANSACTIONS = 'SAVE_TRANSACTIONS'
export const SAVE_PAGE_STATE = 'SAVE_PAGE_STATE'

export const SAVE_TRANSACTIONS_TO_DB = 'SAVE_TRANSACTIONS_TO_DB'
export const GET_TRANSACTIONS_FROM_DB = 'GET_TRANSACTIONS_FROM_DB'
export const GET_TRANSACTIONS_FROM_SERVER = 'GET_TRANSACTIONS_FROM_SERVER'
export const SAVE_ONE_TRANSACTION = 'SAVE_ONE_TRANSACTION'
export const GET_NEXT_TRANSACTIONS_ONLY_STATE = 'GET_NEXT_TRANSACTIONS_ONLY_STATE'

export const PAGE_STATE = {
  STATE_LOADING: 'STATE_LOADING',
  STATE_LOADING_FINISH: 'STATE_LOADING_FINISH',
  STATE_LOADING_NEXT_FINISH: 'STATE_LOADING_NEXT_FINISH',
}

const saveTransactions = (transactions) => ({
  type: SAVE_TRANSACTIONS,
  transactions,
})

export const saveTransactionsToDB = (db, wallet, account, transactions) => ({
  db: db,
  wallet: wallet,
  account: account,
  transactions: transactions,
  type: SAVE_TRANSACTIONS_TO_DB,
})

export const getTransactionsFromDB = (db, wallet, account) => ({
  db: db,
  wallet: wallet,
  account: account,
  type: GET_TRANSACTIONS_FROM_DB,
})

export const getTransactionsFromServer = (db, wallet, account) => ({
  db: db,
  wallet: wallet,
  account: account,
  type: GET_TRANSACTIONS_FROM_SERVER,
})

export const saveOneTransaction = (db, wallet, account, transaction) => ({
  db: db,
  wallet: wallet,
  account: account,
  transaction: transaction,
  type: SAVE_ONE_TRANSACTION,
})

export const getNextTransactionsOnlyState = (db, wallet, account, offset, count) => ({
  db: db,
  wallet: wallet,
  account: account,
  offset: offset,
  count: count,
  type: GET_NEXT_TRANSACTIONS_ONLY_STATE
})
