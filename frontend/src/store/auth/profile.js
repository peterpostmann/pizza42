import AuthService from './AuthService'

function getUserData (key) {
  return AuthService.getters.getUserData(key)
}

const state = {
  data: null,
  authenticated: false,
  custom_data: null
}

const mutations = {
  AUTH_CHANGE (state, payload) {
    state.data = payload.data
    if (payload.data) {
      state.custom_data = {
        email: getUserData('email'),
        email_verified: getUserData('email_verified') || false
      }
    } else {
      state.custom_data = null
    }
    state.authenticated = payload.authenticated
  }
}

export default {
  state,
  mutations
}
