import {GET_INFORMATION, SAVE_SPLASH_STATE} from './actions'

const splashStateReducer = (state = {}, action) => {
  switch(action.type) {
    case SAVE_SPLASH_STATE:
      return Object.assign({}, state, {
        splashState: action.splashState,
      })
    case GET_INFORMATION:
      return Object.assign({}, state, {
        db: action.db,
      })

    default:
      return state
  }
}

export default splashStateReducer
