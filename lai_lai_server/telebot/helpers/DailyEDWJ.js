const moment = require('moment')
const schedule = require('node-schedule')

// Initiate LS incase no key
if (!localStorage.getItem('dailyEDWJ')) {
  let day = moment().format('D_MM_YY')
  let dailyEDWJ = {
    url: `https://bible-study-edwj.s3-ap-southeast-1.amazonaws.com/EDWJ_${day}.jpg`
  }

  localStorage.setItem('dailyEDWJ', JSON.stringify(dailyEDWJ))
}

schedule.scheduleJob('0 0 * * *', () => {
  let localItem = JSON.parse(localStorage.getItem('dailyEDWJ'))
  let day = moment().format('D_MM_YY')
  localItem['url'] = `https://bible-study-edwj.s3-ap-southeast-1.amazonaws.com/EDWJ_${day}.jpg`
  localStorage.setItem('dailyEDWJ', JSON.stringify(localItem))
}) // run everyday at midnight
