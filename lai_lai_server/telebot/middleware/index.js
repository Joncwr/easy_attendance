const { bot, main } = require('../index.js')
const { attendance, dates } = require('../menus/attendance')
const { options } = require('../menus/attendance/options')
const { testimonials } = require('../menus/testimonials')
const { worshipsongs } = require('../menus/worshipsongs')
const TelegramHelper = require ('../helpers/TelegramHelper')
const { attendanceApi } = require('../../routes/publicapi')
const { sendworshipsongs } = require('../menus/sendworshipsongs')
const { registration } = require('../menus/registration')
const { dailydevotion } = require('../menus/dailydevotion')
const { summarynotes, summarynotesdate } = require('../menus/summarynotes')
const { prayer_request_request,prayer_request_pray,prayer_request_pray_confirmation } = require('../menus/prayer_request')
const datesReplyMiddleware = dates.replyMenuMiddleware()
const attendanceReplyMiddleware = attendance.replyMenuMiddleware()
const sendworshipsongsReplyMiddleware = sendworshipsongs.replyMenuMiddleware()
const registrationReplyMiddleware = registration.replyMenuMiddleware()
const prayer_confirmationReplyMiddleware = prayer_request_pray_confirmation.replyMenuMiddleware()
const summarynotesdateReplyMiddleware = summarynotesdate.replyMenuMiddleware()


// COMMANDS =================================================

// RETHINK COMMAND, NEED AUTH + MIDDLEWARE TO GET DATES
// bot.hears('/dates', (ctx, next) => TelegramHelper.auth(ctx, next), dates.replyMenuMiddleware())
//
// bot.hears('/attendance', (ctx, next) => TelegramHelper.auth(ctx, next), attendance.replyMenuMiddleware())

bot.start((ctx, next) => {
  if (ctx.startPayload.search('regfor') !== -1) {
    TelegramHelper.registration(ctx, next, {
      registrationReplyMiddleware,
    })
  }
  else {
    TelegramHelper.auth(ctx, next, {
      datesReplyMiddleware,
      sendworshipsongsReplyMiddleware,
    })
  }
}, main.replyMenuMiddleware())

// ACTIONS
bot.action('a', (ctx, next) => TelegramHelper.getEventDates(ctx.from.id, next), attendance.replyMenuMiddleware())

bot.action(/^a:e.*y$/, (ctx, next) => TelegramHelper.getOptions(ctx, next),options.replyMenuMiddleware())

bot.action(/.*done$/, (ctx) => {
  let telegramId = ctx.from.id
  let localItem = JSON.parse(localStorage.getItem(telegramId))
  let { id, event_id, eventOptions } = localItem
  attendanceApi(id, event_id, true, eventOptions)
  .then(res => {
    TelegramHelper.endMenuConvo(ctx, 'happy')
  })
  .catch(err => {
    console.log(err);
    ctx.answerCbQuery('An error has occurred')
  })
})

bot.action('t', (ctx,next) => TelegramHelper.resetTestimonials(ctx,next), testimonials.replyMenuMiddleware())

bot.action('w', (ctx,next) => TelegramHelper.getWorshipSong(ctx,next), worshipsongs.replyMenuMiddleware())

bot.action('sn', (ctx,next) => TelegramHelper.getSummaryEvents(ctx,next), summarynotes.replyMenuMiddleware())

bot.action('pr:r', (ctx,next) => TelegramHelper.initiatePrayerRequest(ctx,next), prayer_request_request.replyMenuMiddleware())

bot.action('pr:p', (ctx,next) => TelegramHelper.getPrayerRequest(ctx,next), prayer_request_pray.replyMenuMiddleware())

bot.action(/^inatt.*/, (ctx) =>  TelegramHelper.replyAttendance(ctx, {
  datesReplyMiddleware
}))

bot.action(/^inpr.*/, (ctx) =>  TelegramHelper.replyPrayerRequest(ctx, {
  prayer_confirmationReplyMiddleware
}))

bot.action(/^snotes:*/, (ctx) => TelegramHelper.getSummaryNotes(ctx, {
  summarynotesdateReplyMiddleware
}))

// HEARS ==========================================
bot.hears('😇 Start 😇', (ctx,next) => TelegramHelper.auth(ctx, next, {
  datesReplyMiddleware,
  sendworshipsongsReplyMiddleware,
}), main.replyMenuMiddleware())

// TEST ==================================================
// bot.hears('/test', (ctx) => {
//   ctx.replyWithAnimation('https://media.giphy.com/media/3o6YghZV15YGZoOtIk/giphy.gif')
// })
// const Telegram = require('telegraf/telegram')
// const telegramBot = new Telegram(process.env.TELEGRAM_BOT_TOKEN)
// telegramBot.sendMessage(721544223, '', {
//   text: 'l;oplolo',
//   reply_markup: {
//     inline_keyboard: [
//         [{text: 'lol', callback_data: 'a:e.35'}],
//         [{text: 'lol', callback_data: 'my_fancy_event_2'}],
//         [{text: 'lol', callback_data: 'my_fancy_event_3'}]
//     ]
// }
// })
// bot.on('sticker', (ctx) => {
//   console.log(ctx.message);
//   ctx.replyWithSticker('CAADBQADAwADH-QBK4PSHtYCLovsAg')
//   ctx.reply('hi')
// })
// main.manual('tewt', 'a:e-36:y')

module.export=bot

// let regex = /^att.*y$/
// bot.action(regex, (ctx) => {
//   console.log('hi');
//   console.log(ctx.match);
// })
