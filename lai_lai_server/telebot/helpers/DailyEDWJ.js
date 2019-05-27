const moment = require('moment')
const schedule = require('node-schedule')

// Initiate LS incase no key
if (!localStorage.getItem('dailyEDWJ')) {
    let day = moment().format('DD_MM_YY')
    let dailyEDWJ = {
      url: `https://s3-ap-southeast-1.amazonaws.com/bible-study-edwj/EDWJ_${day}.jpeg`
    }

    localStorage.setItem('dailyEDWJ', JSON.stringify(dailyEDWJ))
}

schedule.scheduleJob('0 0 * * *', () => {
  let localItem = JSON.parse(localStorage.getItem('dailyEDWJ'))
  let day = moment().format('DD_MM_YY')
  localItem['url'] = `https://s3-ap-southeast-1.amazonaws.com/bible-study-edwj/EDWJ_${day}.jpeg`
  localStorage.setItem('dailyEDWJ', JSON.stringify(localItem))
}) // run everyday at midnight
