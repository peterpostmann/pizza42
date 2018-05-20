
import axios from 'axios'

export default {

  getProducts (cb) {
    axios.get(process.env.ROOT_API + '/pizza')
      .then(response => {
        cb(response.data.data)
      })
      .catch(e => {
        try {
          alert(e.response.data.error.code + ': ' + e.response.data.error.message)
        } catch (m) {
          alert(e)
        }
      })
  },

  getOrders (cb) {
    const accessToken = localStorage.getItem('access_token') || null
    const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
    const url = process.env.ROOT_API + '/orders'

    const options = {
      method: 'GET',
      headers: headers,
      url
    }

    axios(options)
      .then(response => {
        cb(response.data.data)
      })
      .catch(e => {
        try {
          alert(e.response.data.error.code + ': ' + e.response.data.error.message)
        } catch (m) {
          alert(e)
        }
      })
  },

  postOrder (order, cb) {
    const accessToken = localStorage.getItem('access_token') || null
    const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
    const url = process.env.ROOT_API + '/orders'

    const options = {
      method: 'POST',
      headers: headers,
      data: order,
      url
    }

    axios(options)
      .then(response => {
        cb(response)
      })
      .catch(e => {
        try {
          alert(e.response.data.error.code + ': ' + e.response.data.error.message)
        } catch (m) {
          alert(e)
        }
      })
  }
}
