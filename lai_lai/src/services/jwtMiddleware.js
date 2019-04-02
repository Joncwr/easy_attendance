let axios = require('axios')
let loadingOverlay

module.exports = {
  jwtFetch: (method, endpoint, json) => {
    return new Promise((resolve, reject) => {
      let { token } = JSON.parse(localStorage.getItem('user'))
      loadingOverlay(true)
      axios({
        url: process.env.REACT_APP_SERVER + endpoint,
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        data: JSON.stringify(json),
        timeout: 15000
      })
      .then(res => {
        if (res.status >= 200 && res.status < 300){
          resolve(res.data)
          loadingOverlay(false)
        }
        else {
          reject()
          loadingOverlay(false)
        }
      })
      .catch (err => {
        loadingOverlay(false)
        reject(err)
      })
    })
  },
  publicFetch: (method, endpoint, json) => {
    return new Promise((resolve, reject) => {
      let { token } = JSON.parse(localStorage.getItem('user'))
      loadingOverlay(true)
      axios({
        url: process.env.REACT_APP_SERVER + endpoint,
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        data: JSON.stringify(json),
        timeout: 15000
      })
      .then(res => {
        if (res.status >= 200 && res.status < 300){
          resolve(res.data)
          loadingOverlay(false)
        }
        else {
          reject()
          loadingOverlay(false)
        }
      })
      .catch (err => {
        loadingOverlay(false)
        reject(err)
      })
    })
  },
  setLoadingOverlay: (loadingOverlayParam) => {
    loadingOverlay = loadingOverlayParam
  }
}
