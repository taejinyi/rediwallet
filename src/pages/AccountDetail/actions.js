export const SAVE_MY_PROFILE = 'SAVE_MY_PROFILE'
export const SAVE_WALLET_INFORMATION = 'SAVE_WALLET_INFORMATION'

export const GET_WALLET_INFORMATION_FROM_DB = 'GET_WALLET_INFORMATION_FROM_DB'
export const GET_WALLET_INFORMATION_FROM_SERVER = 'GET_WALLET_INFORMATION_FROM_SERVER'

export const SAVE_WALLET_INFORMATION_TO_DB = 'SAVE_WALLET_INFORMATION_TO_DB'
export const SAVE_WALLET_INFORMATION_FROM_SERVER = 'SAVE_WALLET_INFORMATION_FROM_SERVER'

export const GET_PROFILE_INFORMATION_FROM_DB = 'GET_PROFILE_INFORMATION_FROM_DB'
export const GET_PROFILE_INFORMATION_FROM_SERVER = 'GET_PROFILE_INFORMATION_FROM_SERVER'

export const SAVE_PROFILE_INFORMATION_TO_DB = 'SAVE_PROFILE_INFORMATION_TO_DB'

const saveWalletInformation = (wallet_info) => ({
  type: SAVE_WALLET_INFORMATION,
  wallet_info,
})

export const getWalletInformationFromDB = (db) => ({
  db: db,
  type: GET_WALLET_INFORMATION_FROM_DB,
})

export const saveWalletInformationToDB = (db, wallet_info) => ({
  db: db,
  wallet_info: wallet_info,
  type: SAVE_WALLET_INFORMATION_TO_DB,
})

export const getWalletInformationFromServer = (token, db) => ({
  db: db,
  token: token,
  type: GET_WALLET_INFORMATION_FROM_SERVER,
})

export const getProfileInformationFromDB = (db) => ({
  db: db,
  type: GET_PROFILE_INFORMATION_FROM_DB,
})

export const getProfileInformationFromServer = (db, token) => ({
  db: db,
  token: token,
  type: GET_PROFILE_INFORMATION_FROM_SERVER,
})

export const saveProfileInformationToDB = (db, profile) => ({
  db: db,
  profile: profile,
  type: SAVE_PROFILE_INFORMATION_TO_DB,
})
