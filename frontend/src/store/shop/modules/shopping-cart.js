const state = {
  added: [],
  orderId: ''
}

const mutations = {
  ADD_TO_CART (state, productId) {
    const record = state.added.find(product => product.id === productId)

    if (!record) {
      state.added.push({
        id: productId,
        quantity: 1
      })
    } else {
      record.quantity++
    }

    state.orderId = ''
  },

  REMOVE_FROM_CART (state, item) {
    const index = state.added.findIndex(added => added.id === item.id)
    state.added.splice(index, 1)
    state.orderId = ''
  },

  REMOVE_ALL_FROM_CART (state) {
    state.added = []
    state.orderId = ''
  },

  CHECKOUT (state, orderId) {
    state.added = []
    state.orderId = orderId
  },

  AUTH_CHANGE (state, payload) {
    if (!payload.authenticated) {
      state.orderId = ''
    }
  }
}

export default {
  state,
  mutations
}
