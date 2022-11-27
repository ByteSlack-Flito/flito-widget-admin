import { AuthActions, ProfileActions } from '../actions/userActions'
import { Constants } from '../constants'

export const setLoadingState = data => ({
  type: ProfileActions.SET_LOADING_STATE,
  data
})

export const setUser = data => ({
  type: AuthActions.SET_USER,
  data
})

const initialState = {
  profile: {},
  team: [],
  loadingState: Constants.LoadingState.LOADING,
  error: {},
  userId: undefined
}

export default (state = initialState, action) => {
  let { data } = action

  switch (action.type) {
    case AuthActions.SET_USER:
      // let userId = data
      return { ...state, userId: data } || state

    case ProfileActions.SET_LOADING_STATE:
      // let loadingState = data
      console.log('Setting loading to:', data)
      return { ...state, loadingState: data } || state

    case AuthActions.SET_ERROR:
      let error = data
      return { ...state, error }

    default:
      return state
  }
}
