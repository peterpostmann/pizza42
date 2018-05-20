import Vue from 'vue'
import Router from 'vue-router'
import VueResource from 'vue-resource'
import Shop from '@/components/shop/Shop'
import Checkout from '@/components/shop/Checkout'
import Profile from '@/components/Profile'

Vue.use(Router)
Vue.use(VueResource)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Shop',
      component: Shop
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile
    },
    {
      path: '/checkout',
      name: 'Checkout',
      component: Checkout
    }
  ]
})
