export const SAVE_WALLET = 'SAVE_WALLET'
export const GENERATE_ACCOUNT = 'GENERATE_ACCOUNT'
export const ADD_ACCOUNT = 'ADD_ACCOUNT'
export const SAVE_DEFAULT_ACCOUNT = 'SAVE_DEFAULT_ACCOUNT'
export const GET_WALLET_FROM_NETWORK = 'GET_WALLET_FROM_NETWORK'
export const GET_ACCOUNT_FROM_NETWORK = 'GET_ACCOUNT_FROM_NETWORK'

// export const GET_WALLETS_FROM_DB = 'GET_WALLETS_FROM_DB'
// export const GET_WALLETS_FROM_SERVER = 'GET_WALLETS_FROM_SERVER'
// export const SAVE_WALLETS_TO_DB = 'SAVE_WALLETS_TO_DB'
//
// export const saveWallets = (wallets) => ({
//   wallets: wallets,
//   type: SAVE_WALLETS,
// })
//
// export const saveWalletsToDB = (db, wallets) => ({
//   db: db,
//   wallets: wallets,
//   type: SAVE_WALLETS_TO_DB,
// })
//
// export const getWalletsFromDB = (db) => ({
//   db: db,
//   type: GET_WALLETS_FROM_DB,
// })
export const saveWallet = (db, wallet) => ({
  db: db,
  wallet: wallet,
  type: SAVE_WALLET,
})

export const generateAccount = (db, currency) => ({
  db:db,
  currency: currency,
  type: GENERATE_ACCOUNT
})

export const addAccount = (db, account) => ({
  db: db,
  account: account,
  type: ADD_ACCOUNT,
})

export const saveDefaultAccount = (db, defaultAccount) => ({
  db: db,
  defaultAccount: defaultAccount,
  type: SAVE_DEFAULT_ACCOUNT,
})

export const getWalletFromNetwork = (wallet) => ({
  wallet: wallet,
  type: GET_WALLET_FROM_NETWORK,
})

export const getAccountFromNetwork = (account) => ({
  account: account,
  type: GET_ACCOUNT_FROM_NETWORK,
})
