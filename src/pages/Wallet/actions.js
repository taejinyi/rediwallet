export const SAVE_WALLET = 'SAVE_WALLET'
export const SAVE_WALLETS = 'SAVE_WALLETS'
export const SAVE_WALLET_TO_DB = 'SAVE_WALLET_TO_DB'
export const SAVE_WALLETS_TO_DB = 'SAVE_WALLETS_TO_DB'
export const CREATE_WALLET = 'CREATE_WALLET'
export const ADD_WALLET = 'ADD_WALLET'
export const SET_DEFAULT_WALLET = 'SET_DEFAULT_WALLET'
export const START_WALLET_INSTANCE = 'START_WALLET_INSTANCE'
export const SAVE_WALLET_INSTANCE = 'SAVE_WALLET_INSTANCE'
export const SAVE_WALLET_INSTANCE_TO_DB = 'SAVE_WALLET_INSTANCE_TO_DB'
export const GET_WALLET_FROM_NETWORK = 'GET_WALLET_FROM_NETWORK'
export const GET_WALLETS_FROM_NETWORK = 'GET_WALLETS_FROM_NETWORK'
export const GET_WALLET_FROM_DB = 'GET_WALLET_FROM_DB'
export const GET_WALLETS_FROM_DB = 'GET_WALLETS_FROM_DB'

export const setDefaultWallet = (db, wallet) => ({
  db: db,
  wallet: wallet,
  type: SET_DEFAULT_WALLET,
})

export const addWallet = (db, wallet) => ({
  db: db,
  wallet: wallet,
  type: ADD_WALLET,
})

export const saveWallet = (wallet) => ({
  wallet: wallet,
  type: SAVE_WALLET,
})

export const saveWalletInstance = (iWallet) => ({
  iWallet: iWallet,
  type: SAVE_WALLET_INSTANCE,
})

export const saveWalletInstanceToDB = (db, iWallet) => ({
  db: db,
  iWallet: iWallet,
  type: SAVE_WALLET_INSTANCE_TO_DB,
})

export const saveWallets = (wallets) => ({
  wallets: wallets,
  type: SAVE_WALLETS,
})

export const saveWalletToDB = (db, wallet) => ({
  db: db,
  wallet: wallet,
  type: SAVE_WALLET_TO_DB,
})

export const saveWalletsToDB = (db, wallets) => ({
  db: db,
  wallets: wallets,
  type: SAVE_WALLETS_TO_DB,
})

export const createWallet = (db) => ({
  db: db,
  type: CREATE_WALLET,
})

export const startWalletInstance = (db, wallet) => ({
  db: db,
  wallet: wallet,
  type: START_WALLET_INSTANCE,
})

export const getWalletFromNetwork = (db, iWallet) => ({
  db: db,
  iWallet: iWallet,
  type: GET_WALLET_FROM_NETWORK,
})

export const getWalletsFromNetwork = (db) => ({
  db: db,
  type: GET_WALLETS_FROM_NETWORK,
})

export const getWalletFromDB = (db) => ({
  db: db,
  type: GET_WALLET_FROM_DB,
})

export const getWalletsFromDB = (db) => ({
  db: db,
  type: GET_WALLETS_FROM_DB,
})
