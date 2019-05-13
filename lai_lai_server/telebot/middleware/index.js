const { bot, main } = require('../index.js')
const { attendance, dates } = require('../attendance')
const { options } = require('../attendance/options')
const TelegramHelper = require ('../helpers/TelegramHelper')
const { attendanceApi } = require('../../routes/publicapi')

// COMMANDS
bot.hears('/dates', (ctx, next) => TelegramHelper.auth(ctx, next), dates.replyMenuMiddleware())

bot.hears('/attendance', (ctx, next) => TelegramHelper.auth(ctx, next), attendance.replyMenuMiddleware())

bot.start((ctx, next) => TelegramHelper.auth(ctx, next), main.replyMenuMiddleware())

// ACTIONS
bot.action('a', (ctx, next) => TelegramHelper.getEventDates(ctx.from.id, next), attendance.replyMenuMiddleware())

bot.action(/^a:e.*y$/, (ctx, next) => TelegramHelper.getOptions(ctx, next),options.replyMenuMiddleware())

bot.action(/.*done$/, (ctx) => {
  let telegramId = ctx.from.id
  let localItem = JSON.parse(localStorage.getItem(telegramId))
  let { id, event_id, eventOptions } = localItem
  attendanceApi(id, event_id, true, eventOptions)
  .then(res => {
    TelegramHelper.clearOptions(ctx)
    ctx.deleteMessage()
    ctx.reply('Thank You~')
  })
  .catch(err => {
    console.log(err);
    ctx.answerCbQuery('An error has occurred')
  })
})

bot.hears('/test', (ctx) => {
  ctx.replyWithAnimation('https://media.giphy.com/media/3o6YghZV15YGZoOtIk/giphy.gif')
})

module.export=bot

let regex = /^att.*y$/
bot.action(regex, (ctx) => {
  console.log('hi');
  console.log(ctx.match);
})
