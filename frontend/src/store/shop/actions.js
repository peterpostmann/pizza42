import api from './../../api/api'

export const getProducts = ({ commit }) => {
  api.getProducts(products => {
    commit('RECEIVE_PRODUCTS', products)
  })
}

export const getOrders = ({ commit }) => {
  api.getOrders(orders => {
    commit('RECEIVE_ORDERS', orders)
  })
}

export const addToCart = ({ commit }, product) => {
  commit('ADD_TO_CART', product.id)
}

export const removeFromCart = ({ commit }, product) => {
  commit('REMOVE_FROM_CART', product)
}

export const postOrder = ({ commit }, payload) => {
  const order = payload.order
  const cb = payload.cb

  api.postOrder(order, response => {
    commit('CHECKOUT', response.data.order_id)
    if (cb) cb(response)
  })
}
