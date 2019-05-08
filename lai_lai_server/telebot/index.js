const Telegraf = require('telegraf')
const Markup = require('telegraf/markup')
const TelegrafInlineMenu = require('telegraf-inline-menu')

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN)

const main = new TelegrafInlineMenu(ctx => {
  return `Hey ${ctx.from.first_name}!`
})
const attendanceMenu = require('./attendance')
main.submenu('Attendance', 'a', attendanceMenu)
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
main.setCommand('start')
bot.use(main.init({
  backButtonText: 'back…',
  mainMenuButtonText: 'back to main menu…'
}))

bot.startPolling()
