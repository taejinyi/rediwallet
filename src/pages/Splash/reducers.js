import { SAVE_SPLASH_STATE } from './actions'

const splashStateReducer = (state = {}, action) => {
  switch(action.type) {
    case SAVE_SPLASH_STATE:
      return Object.assign({}, state, {
        splashState: action.splashState,
      })
    default:
      return state
  }
}

export default splashStateReducer
