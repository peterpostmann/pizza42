import Vue from 'vue'
import accounting from 'accounting'
import pluralize from 'pluralize'
import store from './store'
import App from './App'
import router from './router'
import AuthService from './store/auth/AuthService'
import moment from 'moment'

Vue.config.productionTip = false

Vue.filter('formatMoney', accounting.formatMoney)
Vue.filter('pluralize', pluralize)
Vue.filter('formatDate', (value) => {
  return moment(String(value)).format('YYYY-MM-DD HH:mm')
})

AuthService.init(store, router)

new Vue({ // eslint-disable-line no-new
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
