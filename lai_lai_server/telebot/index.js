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
const { dailydevotion } = require('./menus/dailydevotion')
const TelegramHelper = require ('./helpers/TelegramHelper')
require('./helpers/DailyBibleVerse')
require('./helpers/DailyEDWJ')
const main = new TelegrafInlineMenu(ctx => {
  let dailyVerse_ls = JSON.parse(localStorage.getItem('dailyVerse'))
  let localItem = JSON.parse(localStorage.getItem(ctx.from.id))
  let dailyVerse = ''
  let songPicker = ''
  if (dailyVerse_ls.verse) {
    if (dailyVerse_ls.verse !== '') dailyVerse = `📜 Daily Verse: ${dailyVerse_ls.verse}\n`
  }
  if (localItem.songPicker) {
    songPicker = `\n\n Next worship song by: ${localItem.songPicker}! 🎵`
  }
  return `${dailyVerse}There are ${localItem.prayerRequestCount} prayer request at the moment! 🙏${songPicker}\n\nSo glad to see you here again ${ctx.from.first_name}! ☺️`
})
module.exports = { bot, main }
require('./middleware')

main.submenu('🗓 Attendance', 'a', attendance)
main.submenu('✨ Sharings', 't', testimonials, {
  joinLastRow: true
})
main.submenu('🎸 Current Worship Songs', 'w', worshipsongs)
main.submenu('✍️ Summary Notes', 'sn', summarynotes, {
  joinLastRow: true
})
main.submenu('🙏 Prayer Room', 'pr', prayer_request)
main.submenu('🌅 Daily Devotion', 'dd', dailydevotion, {
  joinLastRow: true
})
main.submenu('🎸 Send Worship Songs Dedication', 'sw', sendworshipsongs, {
  hide: (ctx) => {
    if (ctx.match) {
      if (ctx.match[0] === 'main' || ctx.match === 'main') return true
    }
    else return false
  }
})

// Inline Queriesssss=======================================
const bible = require('holy-bible');
const BibleBookFormatter = require('./helpers/BibleBookFormatter')
bot.on('inline_query', ({ inlineQuery, answerInlineQuery }) => {
  bible.get(inlineQuery.query, 'ASV')
  .then(res => {
    let book = res.passage.split('.')
    let bookNameFormatted = BibleBookFormatter.abbrevConverter(book[0])
    let bookRegex = new RegExp(book[0], 'g')
    let passage = res.passage.replace(bookRegex, bookNameFormatted)
    let result = [{
      type: 'article',
      title: `${passage}` || 'null',
      description: `Your query: ${inlineQuery.query}` || 'null',
      id: 1,
      input_message_content: {
        message_text: `*${passage}*\n_"${res.text}"_`,
        parse_mode: 'Markdown'
      }
    }]
    return answerInlineQuery(result)
  })
  .catch(err => {})
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
