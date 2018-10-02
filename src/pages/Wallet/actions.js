export const SAVE_WALLETS = 'SAVE_WALLETS'
export const GET_WALLETS_FROM_DB = 'GET_WALLETS_FROM_DB'
export const GET_WALLETS_FROM_SERVER = 'GET_WALLETS_FROM_SERVER'
export const SAVE_WALLETS_TO_DB = 'SAVE_WALLETS_TO_DB'
export const ADD_WALLET = 'ADD_WALLET'

export const saveWallets = (wallets) => ({
  wallets: wallets,
  type: SAVE_WALLETS,
})

export const saveWalletsToDB = (db, wallets) => ({
  db: db,
  wallets: wallets,
  type: SAVE_WALLETS_TO_DB,
})

export const getWalletsFromDB = (db) => ({
  db: db,
  type: GET_WALLETS_FROM_DB,
})

export const addWallet = (db, wallet) => ({
  db: db,
  wallet: wallet,
  type: ADD_WALLET,
})
