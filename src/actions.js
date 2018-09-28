export const SAVE_MNEMONIC = 'SAVE_MNEMONIC'
export const SAVE_IS_LOCKED = 'SAVE_MNEMONIC'

export const SHOW_PROCESSING_MODAL = 'SHOW_PROCESSING_MODAL'
export const HIDE_PROCESSING_MODAL = 'HIDE_PROCESSING_MODAL'

export const saveMnemonic = (mnemonic) => ({
  mnemonic: mnemonic,
  type: SAVE_MNEMONIC,
})

export const saveIsLocked = (isLocked) => ({
  isLocked: isLocked,
  type: SAVE_IS_LOCKED
})
export const showProcessingModal = (message) => ({
  message: message,
  type: SHOW_PROCESSING_MODAL,
})

export const hideProcessingModal = () => ({
  type: HIDE_PROCESSING_MODAL,
})
