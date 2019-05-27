if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}
const Telegraf = require('telegraf')
const Markup = require('telegraf/markup')
const TelegrafInlineMenu = require('telegraf-inline-menu')
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN)

const { attendance, dates } = require('./menus/attendance')
const { testimonials } = require('./menus/testimonials')
const { worshipsongs } = require('./menus/worshipsongs')
const { sendworshipsongs } = require('./menus/sendworshipsongs')
const { registration } = require('./menus/registration')
const { summarynotes } = require('./menus/summarynotes')
const { prayer_request } = require('./menus/prayer_request')
const TelegramHelper = require ('./helpers/TelegramHelper')
require('./helpers/DailyBibleVerse')
const main = new TelegrafInlineMenu(ctx => {
  let dailyVerse_ls = JSON.parse(localStorage.getItem('dailyVerse'))
  let localItem = JSON.parse(localStorage.getItem(ctx.from.id))
  let dailyVerse = ''
  if (dailyVerse_ls.verse) {
    if (dailyVerse_ls.verse !== '') dailyVerse = `📜 Daily Verse: ${dailyVerse_ls.verse}\n`
  }
  return `${dailyVerse}🙏 There are ${localItem.prayerRequestCount} prayer request at the moment!\n\nSo glad to see you here again ${ctx.from.first_name}! ☺️`
})
module.exports = { bot, main }
require('./middleware')

main.submenu('🗓 Attendance', 'a', attendance)
main.submenu('✨ Sharings', 't', testimonials)
main.submenu('🎸 Current Worship Songs Dedication', 'w', worshipsongs)
main.submenu('✍️ Summary Notes', 'sn', summarynotes)
main.submenu('🙏 Prayer Room', 'pr', prayer_request)
main.submenu('🎸 Send Worship Songs Dedication', 'sw', sendworshipsongs, {
  hide: (ctx) => {
    if (ctx.match) {
      if (ctx.match[0] === 'main' || ctx.match === 'main') return true
    }
    else return false
  }
})

bot.use(main.init({
  backButtonText: 'back…',
  mainMenuButtonText: 'back to main menu…'
}))
bot.use(registration.init())
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
