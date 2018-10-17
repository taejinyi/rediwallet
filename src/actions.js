export const SAVE_SEED = 'SAVE_SEED'
export const SAVE_UNLOCKED = 'SAVE_UNLOCKED'

export const SHOW_PROCESSING_MODAL = 'SHOW_PROCESSING_MODAL'
export const HIDE_PROCESSING_MODAL = 'HIDE_PROCESSING_MODAL'

export const saveSeed = (seed) => ({
  seed: seed,
  type: SAVE_SEED,
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
