const TelegrafInlineMenu = require('telegraf-inline-menu')
const TelegramHelper = require ('../TelegramHelper')
const { closed } = require('../closed')
const bot = require('../index.js')
let message = 'Which date will you be taking attendance for!'
const attendance = new TelegrafInlineMenu(ctx => {
  return message
})

const dates = new TelegrafInlineMenu(ctx => {
  return 'Great! Will you be attending?'
})

const options = new TelegrafInlineMenu(ctx => {
  return 'Great! Will you be attending?'
})

dates.button('Yes', 'y', {
  doFunc: (ctx) => {
    console.log(ctx.match[1]);
  },
})

dates.button('No', 'n', {
  doFunc: (ctx) => {
    console.log(ctx.match[1]);
    ctx.deleteMessage()
    ctx.reply('Thank You~')
  },
  joinLastRow: true,
})

dates.selectSubmenu('op', (ctx) => getOptions(ctx), options)

function getEvents(ctx) {
  let { dates } = TelegramHelper.getDates()
  return dates
}

function getOptions(ctx) {
  console.log(ctx.match[0].substr(ctx.match[0].length -1) );
  if (ctx.match[0].substr(ctx.match[0].length -1) === 'y') {
    let id = ctx.match[1].toString()
    let { eventOptions } = TelegramHelper.getDates()
    console.log(eventOptions[id]);
    return ['e','e']
  }
  else {
    return []
  }
}

attendance.selectSubmenu('ev', (ctx) => getEvents(ctx), dates)

module.exports = {
  attendance,
  dates,
}
