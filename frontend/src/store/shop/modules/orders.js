const state = {
  data: []
}

const mutations = {
  RECEIVE_ORDERS (state, orders) {
    state.data = orders
  },

  AUTH_CHANGE (state, payload) {
    if (!payload.authenticated) {
      state.data = []
    }
  }
}

export default {
  state,
  mutations
}
