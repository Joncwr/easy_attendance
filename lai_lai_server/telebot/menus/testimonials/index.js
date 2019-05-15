const TelegrafInlineMenu = require('telegraf-inline-menu')
const TelegramHelper = require('../../helpers/TelegramHelper')
const { addTestimonial } = require('../../../routes/publicapi')

const testimonials = new TelegrafInlineMenu(ctx => {
  let id = ctx.from.id
  let localItem = JSON.parse(localStorage.getItem(id))
  if (!localItem.testimonials.testimonial) {
    return `So glad your here today ${ctx.from.first_name}, please click on the button below to start sharing!`
  }
  else {
    return `Your sharing: '__${localItem.testimonials.testimonial}__' \nPlease click the button to confirm your sharing!! 😍`
  }
})

testimonials.question((ctx) => {
  return `✨ Sharing is Caring ✨`
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
    let telegramId = ctx.from.id
    let localItem = JSON.parse(localStorage.getItem(telegramId))
    let { id, group_id, testimonials } = localItem
    addTestimonial(testimonials.testimonial, id, group_id)
    .then(res => {
      TelegramHelper.endMenuConvo(ctx, 'happy')
    })
    .catch(err => {
      console.log(err)
      ctx.reply('An error has occurred.')
    })
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
