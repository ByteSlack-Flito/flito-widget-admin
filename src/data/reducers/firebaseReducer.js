import { FirebaseActions } from '../actions'

export const setFirebaseApp = data => ({
  type: FirebaseActions.SET,
  data
})

const initialState = {
  firebase: {}
}

export default (state = initialState, action) => {
  switch (action.type) {
    case FirebaseActions.SET:
      const { data } = action
      let instance = data
      return { ...state.firebase, instance } || state
    default:
      return state
  }
}
