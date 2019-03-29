const axios = require('../axios')

module.exports = {
  getDate: () => {
    return new Promise((resolve, reject) => {
      axios.axiosApi('get', 'date/getDate')
      .then(res => {
        if (res) resolve(res)
        else reject(res)
      })
      .catch(err => reject(err))
    })
  },
  updateDate: (dateDict) => {
    return new Promise((resolve, reject) => {
      axios.axiosApi('put', 'date/updateDate', dateDict)
      .then(res => {
        if (res) resolve(res)
        else reject(res)
      })
      .catch(err => reject(err))
    })
  },
}
