const TelegrafInlineMenu = require('telegraf-inline-menu')
const TelegramHelper = require('../../helpers/TelegramHelper')
const Markup = require('telegraf/markup')

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

dailydevotion.simpleButton('📖 How to use Bible Search (Inline Query)', 'iq', {
  doFunc: (ctx) => {
    ctx.reply(`To use the Bible Search, either click the button below or you can manually do it anywhere and anytime on telegram when you type '@BibleStudySG_Bot *bookname:chapter:verse*', you can use short forms too!\nExample: @BibleStudySG_Bot 1cor1:1\nor\n@BibleStudySG_Bot 1cor1:1-3 (for a range of verses :)`, Markup
      .inlineKeyboard([
        Markup.switchToCurrentChatButton('🔍 Search Bible!','',false)
      ])
      .extra()
    )
  }
})

module.exports = {
  dailydevotion,
}
