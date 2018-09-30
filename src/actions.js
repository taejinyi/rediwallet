export const SAVE_MNEMONIC = 'SAVE_MNEMONIC'
export const SAVE_UNLOCKED = 'SAVE_UNLOCKED'

export const SHOW_PROCESSING_MODAL = 'SHOW_PROCESSING_MODAL'
export const HIDE_PROCESSING_MODAL = 'HIDE_PROCESSING_MODAL'

export const saveMnemonic = (mnemonic) => ({
  mnemonic: mnemonic,
  type: SAVE_MNEMONIC,
})

export const saveUnlocked = (unlocked) => ({
  unlocked: unlocked,
  type: SAVE_UNLOCKED
})
export const showProcessingModal = (message) => ({
  message: message,
  type: SHOW_PROCESSING_MODAL,
})

export const hideProcessingModal = () => ({
  type: HIDE_PROCESSING_MODAL,
})
