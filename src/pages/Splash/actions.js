export const SAVE_SPLASH_STATE = 'SAVE_SPLASH_STATE'
export const GET_INFORMATION = 'GET_INFORMATION'

export const SPLASH_STATE = {
  STATE_FINISH: 'STATE_FINISH',
}

export const getInformation = (db) => ({
  db: db,
  type: GET_INFORMATION,
})
