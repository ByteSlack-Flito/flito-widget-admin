import { RoadmapActions } from '../actions/roadmapActions'

export const mvpAddScreen = mvp => ({
  type: RoadmapActions.MVP.ADD_SCREEN,
  mvp
})

const initialState = {
  mvp: {
    screens: [],
    edges: []
  }
}

export default (state = initialState, action) => {
  const { data } = action
  let screens = [...state.mvp.screens]
  let edges = [...state.mvp.edges]
  let mvp = {
    screens: screens,
    edges: edges
  }
  switch (action.type) {
    case RoadmapActions.MVP.ADD_SCREEN:
      // console.log('Got to screen')
      screens.push(data)
      return { ...state, mvp } || state
    case RoadmapActions.MVP.ADD_EDGE:
      // console.log('Got to edge')
      // data.key = getRandomInteger(99, 9090909)
      edges.push(data)
      return { ...state, mvp } || state
    case RoadmapActions.MVP.UPDATE_SCREEN:
      let currentIndex = screens.findIndex(x => x.id === data.id)
      let currentScreen = { ...screens.find(x => x.id === data.id), ...data }
      screens[currentIndex] = currentScreen
      mvp.screens = screens
      return { ...state, mvp } || state

    case RoadmapActions.MVP.REMOVE_SCREEN:
      mvp.screens = screens.filter(x => x.id !== data.id)
      return { ...state, mvp } || state
    default:
      return state
  }
}
