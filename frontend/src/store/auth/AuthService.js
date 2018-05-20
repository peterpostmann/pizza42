import Auth0Lock from 'auth0-lock'
import AUTH_CONFIG from './../../../../backend/config/auth0-variables.json'
import decode from 'jwt-decode'

var router

const lock = new Auth0Lock(AUTH_CONFIG.clientId, AUTH_CONFIG.domain, {
  autoclose: true,
  auth: {
    redirectUrl: window.location,
    audience: `${AUTH_CONFIG.audience}`,
    responseType: 'token id_token',
    params: {
      scope: 'openid profile'
    }
  },
  languageDictionary: {
    title: 'Pizza42 🍕'
  }
})

const actions = {

  login () {
    localStorage.setItem('lastpath', router.history.current.fullPath)

    // Call the show method to display the widget.
    lock.show()
  },

  getAccessToken () {
    const accessToken = localStorage.getItem('access_token')
    if (!accessToken) {
      throw new Error('No access token found')
    }
    return accessToken
  },

  getProfile ({ commit, dispatch }, cb) {
    let accessToken = actions.getAccessToken()
    lock.getUserInfo(accessToken, (err, profile) => {
      if (err) console.log('getProfile error: ', err, profile)
      if (profile) commit('AUTH_CHANGE', { data: profile, authenticated: true })
      if (cb) cb(err, profile)
    })
  },

  setSession ({commit, dispatch}, authResult) {
    if (authResult && authResult.accessToken && authResult.idToken) {
      // Set the time that the access token will expire at
      let expiresAt = JSON.stringify(
        authResult.expiresIn * 1000 + new Date().getTime()
      )
      localStorage.setItem('access_token', authResult.accessToken)
      localStorage.setItem('id_token', authResult.idToken)
      localStorage.setItem('expires_at', expiresAt)

      commit('AUTH_CHANGE', { data: decode(authResult.idToken), authenticated: true })

      // navigate to the home route
      var lastpath = localStorage.getItem('lastpath') || '/'
      router.push(lastpath)
    }
  },

  logout ({ commit }) {
    // Clear access token and ID token from local storage
    localStorage.removeItem('access_token')
    localStorage.removeItem('id_token')
    localStorage.removeItem('expires_at')

    commit('AUTH_CHANGE', { data: null, authenticated: false })
  }
}

const getters = {

  isAuthenticated () {
    // Check whether the current time is past the
    // access token's expiry time
    let expiresAt = JSON.parse(localStorage.getItem('expires_at'))
    return new Date().getTime() < expiresAt
  },

  getUserData (key) {
    const namespace = AUTH_CONFIG.namespace
    const idData = decode(localStorage.getItem('id_token'))

    if (idData) {
      return idData[`${namespace}/${key}`] || null
    }
  }
}

function init (store, _router) {
  // Register self
  store.registerModule('AuthService', this)

  // Add callback Lock's `authenticated` event
  lock.on('authenticated', (authResult) => {
    store.dispatch('setSession', authResult)
  })

  // Add callback for Lock's `authorization_error` event
  lock.on('authorization_error', (error) => {
    console.log(error)
    var lastpath = localStorage.getItem('lastpath') || '/'
    router.push(lastpath)
  })

  // Add router
  router = _router

  // Check localStorage
  if (getters.isAuthenticated()) {
    store.commit('AUTH_CHANGE', { data: decode(localStorage.getItem('id_token')), authenticated: true })
  } else {
    store.dispatch('logout')
  }
}

export default {
  actions,
  getters,
  init
}
