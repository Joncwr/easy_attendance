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

// dailydevotion.button('refresh', 'test', {
//   doFunc: (ctx) => {
//     ctx.replyWithPhoto('https://s3-ap-southeast-1.amazonaws.com/bible-study-edwj/EDWJ_27_05_19.jpeg')
//   }
// })

module.exports = {
  dailydevotion,
}
