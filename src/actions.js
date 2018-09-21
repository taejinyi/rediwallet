export const SAVE_PIN_NUMBER = 'SAVE_PIN_NUMBER'
export const SAVE_MNEMONIC = 'SAVE_MNEMONIC'
export const LOAD_MNEMONIC = 'LOAD_MNEMONIC'

export const SHOW_PROCESSING_MODAL = 'SHOW_PROCESSING_MODAL'
export const HIDE_PROCESSING_MODAL = 'HIDE_PROCESSING_MODAL'

export const savePinNumber = (db, pinNumber) => ({
  db: db,
  pinNumber: pinNumber,
  type: SAVE_PIN_NUMBER,
})
// TODO
// export const loadMnemonic = (db) => ({
//   db: db,
//   type: LOAD_MNEMONIC,
// })

export const saveMnemonic = (db, mnemonic) => ({
  db: db,
  mnemonic: mnemonic,
  type: SAVE_MNEMONIC,
})

export const showProcessingModal = (message) => ({
  message: message,
  type: SHOW_PROCESSING_MODAL,
})

export const hideProcessingModal = () => ({
  type: HIDE_PROCESSING_MODAL,
})
