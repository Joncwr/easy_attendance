const TelegrafInlineMenu = require('telegraf-inline-menu')
const TelegramHelper = require('../../helpers/TelegramHelper')
const { attendanceApi } = require('../../../routes/publicapi')
const ObjectHelper = require('../../helpers/ObjectHelper')
const { options } = require('./options')

const attendance = new TelegrafInlineMenu(ctx => {
  let { dates } = TelegramHelper.getDates()
  if (ObjectHelper.isEmpty(dates)) {
    return `I'm sorry, there are no available events yet! 😢`
  }
  else {
    return 'Which date will you be taking attendance for! 🥳'
  }
})

const dates = new TelegrafInlineMenu(ctx => {
  return 'Great! Will you be attending? We do hope you will! 🥰'
})

dates.manual('Yes', 'y')

dates.button('No', 'n', {
  doFunc: (ctx) => {
    // Do not attendening API here
    TelegramHelper.getTelegramId(ctx.from.id)
    .then(([res]) => {
      let attendee_id = res.id
      let event_id = ctx.match[1]
      let status = false
      attendanceApi(attendee_id, event_id, status)
      .then(res => {
        TelegramHelper.endMenuConvo(ctx, 'sad')
      })
      .catch(err => {
        console.log(err);
        ctx.reply('Error has occured')
      })
    })
    .catch(err => {
      console.log(err);
    })
  },
  joinLastRow: true,
})

function getEvents(ctx) {
  let { dates } = TelegramHelper.getDates()
  return dates
}

attendance.selectSubmenu('e', (ctx) => getEvents(ctx), dates)

attendance.submenu('Options', 'o', options, {
  hide: (ctx) => {
    if (ctx.match) {
      if (ctx.match[0] === 'a') return true
    }
  }
})

module.exports = {
  attendance,
  dates,
}
