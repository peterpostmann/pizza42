import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import * as actions from './shop/actions'
import * as getters from './shop/getters'
import products from './shop/modules/products'
import orders from './shop/modules/orders'
import shoppingCart from './shop/modules/shopping-cart'
import profile from './auth/profile'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  actions,
  getters,
  modules: {
    profile,
    products,
    orders,
    shoppingCart
  },
  strict: debug,
  plugins: [createPersistedState()]
})
