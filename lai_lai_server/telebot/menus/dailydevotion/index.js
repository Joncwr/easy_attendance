const TelegrafInlineMenu = require('telegraf-inline-menu')
const TelegramHelper = require('../../helpers/TelegramHelper')

const dailydevotion = new TelegrafInlineMenu(ctx => {
  return getValue(ctx, 'menuText')
}, {
  photo: (ctx) => {
    return getValue(ctx, 'photo')
  }
})

function getValue(ctx, method) {
  let localItem = JSON.parse(localStorage.getItem('dailyEDWJ'))
  if (method === 'menuText') {
    return `💝 Hello! You will find your daily devotional content here! 🤟`
  }
  else if (method === 'photo') {
    if (localItem.url) {
      return localItem.url
    }
  }
}

module.exports = {
  dailydevotion,
}
