const { bot, main } = require('../index.js')
const { attendance, dates } = require('../menus/attendance')
const { options } = require('../menus/attendance/options')
const { testimonials } = require('../menus/testimonials')
const { worshipsongs } = require('../menus/worshipsongs')
const TelegramHelper = require ('../helpers/TelegramHelper')
const { attendanceApi } = require('../../routes/publicapi')
const { sendworshipsongs } = require('../menus/sendworshipsongs')
const { registration } = require('../menus/registration')
const { summarynotes } = require('../menus/summarynotes')
const datesReplyMiddleware = dates.replyMenuMiddleware()
const attendanceReplyMiddleware = attendance.replyMenuMiddleware()
const sendworshipsongsReplyMiddleware = sendworshipsongs.replyMenuMiddleware()
const registrationReplyMiddleware = registration.replyMenuMiddleware()


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

bot.action('a:o:done', (ctx) => {
  console.log(ctx);
})

// TEST ==================================================
bot.hears('/test', (ctx) => {
  ctx.replyWithAnimation('https://media.giphy.com/media/3o6YghZV15YGZoOtIk/giphy.gif')
})

// bot.on('sticker', (ctx) => {
//   console.log(ctx.message);
//   ctx.replyWithSticker('CAADBQADAQADH-QBK5v1jkw34ZM6Ag')
//   ctx.reply('hi')
// })
// main.manual('tewt', 'a:e-36:y')

module.export=bot

// let regex = /^att.*y$/
// bot.action(regex, (ctx) => {
//   console.log('hi');
//   console.log(ctx.match);
// })
