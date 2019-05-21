const TelegrafInlineMenu = require('telegraf-inline-menu')
const TelegramHelper = require('../../helpers/TelegramHelper')
const { addPrayerRequest } = require('../../../routes/publicapi')

const prayer_request = new TelegrafInlineMenu(ctx => {
  let id = ctx.from.id
  let localItem = JSON.parse(localStorage.getItem(id))
  return `Welcome to the prayer room 🙏, please feel free to request for prayers and to pray for others as well. 😇`
})

const prayer_request_request = new TelegrafInlineMenu(ctx => {
  return getValue(ctx, 'getRequestMenu')
})

prayer_request_request.question((ctx) => {
  return `🙏  Request Mandatory Prayers 🙏`
}, 'c1', {
  questionText: 'Please feel free to request for any prayers.',
  setFunc: (ctx, answer) => {
    let id = ctx.from.id
    let localItem = JSON.parse(localStorage.getItem(id))
    localItem.prayerRequest = answer
    localStorage.setItem(id, JSON.stringify(localItem))
  },
})

prayer_request_request.button('Confirm the Request! 👊', 'cfm', {
  doFunc: (ctx) => {
    let telegramId = ctx.from.id
    let localItem = JSON.parse(localStorage.getItem(telegramId))
    let { id, group_id, prayerRequest } = localItem
    let prayerDict = {attendee_id: id, group_id, description: prayerRequest}
    addPrayerRequest(prayerDict)
    .then(res => {
      localItem.prayerRequest = ''
      localStorage.setItem(ctx.from.id, JSON.stringify(localItem))
    })
    .catch(err => {
      console.log(err)
      ctx.reply('An error has occurred.')
    })
  },
  setParentMenuAfter: true,
})

const prayer_request_pray = new TelegrafInlineMenu(ctx => {
  let id = ctx.from.id
  let localItem = JSON.parse(localStorage.getItem(id))
  return `I'm so happy to see you here ${ctx.from.first_name} 😘, prayer is such an important part of any christian group. Please select one of the prayer request below to pray for. ❤️`
})

prayer_request.submenu('To Pray 🙏', 'p', prayer_request_pray)
prayer_request.submenu('To Be Prayed For 💞', 'r', prayer_request_request)


function getValue(ctx, method, value) {
  let id = ctx.from.id
  let localItem = JSON.parse(localStorage.getItem(id))
  if (method === 'getRequestMenu') {
    return `Welcome to the prayer request room 😊, please click on the button below to send us a prayer request as we would love to pray for/with you! 💞\n\nPrayer Request: ${localItem.prayerRequest}`
  }
}

// testttt
prayer_request.button('refresh', 'tet', {
  doFunc: (ctx) => {

  }
})

// prayer_request_request.button('refresh', 'tet', {
//   doFunc: (ctx) => {
//
//   }
// })

prayer_request_pray.button('refresh', 'tet', {
  doFunc: (ctx) => {

  }
})

module.exports = {
  prayer_request,
  prayer_request_request,
  prayer_request_pray,
}
