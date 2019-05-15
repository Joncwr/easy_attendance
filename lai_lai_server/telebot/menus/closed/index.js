const TelegrafInlineMenu = require('telegraf-inline-menu')
const TelegramHelper = require ('../TelegramHelper')

const closed = new TelegrafInlineMenu(ctx => {
  return 'Thank You!'
})

module.exports = {
  closed,
}
