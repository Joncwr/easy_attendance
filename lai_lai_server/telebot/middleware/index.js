const { bot, main } = require('../index.js')
const { attendance, dates } = require('../attendance')
const { options } = require('../attendance/options')
const TelegramHelper = require ('../helper/TelegramHelper')

// COMMANDS
bot.hears('/dates', (ctx, next) => TelegramHelper.auth(ctx, next), dates.replyMenuMiddleware())

bot.hears('/attendance', (ctx, next) => TelegramHelper.auth(ctx, next), attendance.replyMenuMiddleware())

bot.hears('/start', (ctx, next) => TelegramHelper.auth(ctx, next), main.replyMenuMiddleware())

// ACTIONS
bot.action('a', (ctx, next) => TelegramHelper.getEventDates(ctx.from.id, next), attendance.replyMenuMiddleware())

bot.action(/^a:e.*y$/, (ctx, next) => TelegramHelper.getOptions(ctx, next),options.replyMenuMiddleware())

bot.hears('/test', options.replyMenuMiddleware())
main.manual('tewt', 'a:e-36:y')

module.export=bot

let regex = /^att.*y$/
bot.action(regex, (ctx) => {
  console.log('hi');
  console.log(ctx.match);
})
