if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}
const Telegraf = require('telegraf')
const Markup = require('telegraf/markup')
const TelegrafInlineMenu = require('telegraf-inline-menu')
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN)

const { attendance, dates } = require('./attendance')
const TelegramHelper = require ('./helper/TelegramHelper')
const main = new TelegrafInlineMenu(ctx => {
  return `Hey ${ctx.from.first_name}!`
})

module.exports = { bot, main }
require('./middleware')

main.submenu('Attendance', 'a', attendance)
bot.use(main.init({
  backButtonText: 'back…',
  mainMenuButtonText: 'back to main menu…'
}))
bot.catch((err) => {
  console.log('Ooops', err)
})
bot.startPolling()

// TelegramHelper.test(721544223)
// .then(res => {
//   console.log(res);
// })

// main.button('MainMenu', 'm', {
//   doFunc: ({ reply }) => {
//     return reply('Custom buttons keyboard', Markup
//       .keyboard([
//         ['/start', '😎 Popular'], // Row1 with 2 buttons
//         ['☸ Setting', '📞 Feedback'], // Row2 with 2 buttons
//         ['📢 Ads', '⭐️ Rate us', '👥 Share'] // Row3 with 3 buttons
//       ])
//       .oneTime()
//       .resize()
//       .extra()
//     )
//   },
// })
//
// const replyMiddleware = main.replyMenuMiddleware()
// bot.start((ctx) => {
//   if (ctx.startPayload) {
//     if (ctx.startPayload === 'attendance') {
//       replyMiddleware.setSpecific(ctx, 'main-b')
//     }
//   }
//   console.log(ctx.startPayload);
// })
