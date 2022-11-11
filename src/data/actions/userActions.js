export const ProfileActions = {
  GET_TEAM: 'profile/team',
  SET_TEAM: 'profile/team/set',
  ADD_TEAM_MEMBER: 'proifle/team/add',
  UPDATE_TEAM_MEMBER: 'profile/team/update',

  UPDATE_PROFILE: 'profile/update',
  GET_PROFILE: 'profile',
  SET_PROFILE: 'profile/set',
  SET_LOADING_STATE: 'profile/loading/set'
}

export const AuthActions = {
  PERFORM_SIGNUP: 'user/signup',
  PERFORM_SIGNIN: 'user/signin',
  PERFORM_SIGNIN_LOCAL: 'user/signin/local',
  PERFORM_SIGNOUT: 'user/signout',
  SET_ERROR: 'user/error'
}

export const ProjectActions = {
  PERFORM_FEATURE_CHANGE: 'project/current/feature/modify',
  SET_PROJECT: 'project/current/set'
}
