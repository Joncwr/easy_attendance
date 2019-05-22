const axios = require('axios')
const schedule = require('node-schedule')

// Initiate LS incase no key
if (!localStorage.getItem('dailyVerse')) {
  axios.get('https://beta.ourmanna.com/api/v1/get/?format=text')
  .then(res => {
    let dailyVerse = {
      verse: res.data
    }
    localStorage.setItem('dailyVerse', JSON.stringify(dailyVerse))
  })
}

schedule.scheduleJob('0 0 * * *', () => {
  axios.get('https://beta.ourmanna.com/api/v1/get/?format=text')
  .then(res => {
    let localItem = JSON.parse(localStorage.getItem('dailyVerse'))
    localItem['verse'] = res.data
    localStorage.setItem('dailyVerse', JSON.stringify(localItem))
  })
}) // run everyday at midnight
