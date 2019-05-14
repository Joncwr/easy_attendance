const TelegrafInlineMenu = require('telegraf-inline-menu')
const TelegramHelper = require('../helpers/TelegramHelper')

const testimonials = new TelegrafInlineMenu(ctx => {
  let id = ctx.from.id
  let localItem = JSON.parse(localStorage.getItem(id))
  if (!localItem.testimonials) localItem['testimonials'] = {}
  localStorage.setItem(id, JSON.stringify(localItem))
  if (!localItem.testimonials.testimonial) {
    return `So glad your here today ${ctx.from.first_name}, please click on the button below to start sharing!`
  }
  else {
    return `Please click the button to confirm your sharing!! 😍`
  }
})

testimonials.question((ctx) => {
  return '✨ Sharing is Caring ✨'
}, 'c1', {
  questionText: 'Please feel free to share whatever you like!',
  setFunc: (ctx, answer) => {
    let id = ctx.from.id
    let localItem = JSON.parse(localStorage.getItem(id))
    localItem.testimonials['testimonial'] = answer
    localStorage.setItem(id, JSON.stringify(localItem))
  },
  hide: (ctx) => {
    let id = ctx.from.id
    let localItem = JSON.parse(localStorage.getItem(id))
    if (!localItem.testimonials.testimonial) return false
    else return true
  },
})

testimonials.simpleButton('Confirm the sharing! 👊', 'cfm', {
  doFunc: (ctx) => {
    let id = ctx.from.id
    let localItem = JSON.parse(localStorage.getItem(id))
    localItem.testimonials = {}
    localStorage.setItem(id, JSON.stringify(localItem))
    ctx.deleteMessage()
    ctx.reply('Thank You~')
  },
  hide: (ctx) => {
    let id = ctx.from.id
    let localItem = JSON.parse(localStorage.getItem(id))
    if (localItem.testimonials.testimonial) return false
    else return true
  },
})

module.exports = {
  testimonials,
}
