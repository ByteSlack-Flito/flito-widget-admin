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
  let profile = { ...state.profile }
  let team = [...state.team]

  switch (action.type) {
    case AuthActions.SET_USER:
      let userId = data
      return { ...state, userId } || state

    case ProfileActions.SET_LOADING_STATE:
      console.log('Loading set to...:', data)
      let loadingState = data
      return { ...state, loadingState } || state

    case AuthActions.SET_ERROR:
      let error = data
      return { ...state, error }

    default:
      return state
  }
}
