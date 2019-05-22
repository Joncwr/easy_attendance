const TelegrafInlineMenu = require('telegraf-inline-menu')
const TelegramHelper = require('../../helpers/TelegramHelper')
const ObjectHelper = require('../../helpers/ObjectHelper')
const TelegramMessengerHelper = require('../../helpers/TelegramMessengerHelper')
const { addPrayerRequest } = require('../../../routes/publicapi')
const Prayer_Request = require('../../../models/prayer_request')

const prayer_request = new TelegrafInlineMenu(ctx => {
  let id = ctx.from.id
  let localItem = JSON.parse(localStorage.getItem(id))
  return `Welcome to the prayer room 🙏, please feel free to request for prayers and to pray for others as well. 😇`
})

// This is the page for Prayer Requests =========================
const prayer_request_request = new TelegrafInlineMenu(ctx => {
  let id = ctx.from.id
  let localItem = JSON.parse(localStorage.getItem(id))
  return `Welcome to the prayer request room 😊, please click on the button below to send us a prayer request as we would love to pray for/with you! 💞\n\nPrayer Request: ${localItem.prayerRequest}`
})

prayer_request_request.question((ctx) => {
  return `🙏  Request Mandatory Prayers (Click) 🙏`
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
    if (prayerRequest !== '') {
      addPrayerRequest(prayerDict)
      .then(res => {
        TelegramMessengerHelper.broadcastPrayerRequest(ctx, res.id)
        localItem.prayerRequest = ''
        localStorage.setItem(ctx.from.id, JSON.stringify(localItem))
        ctx.reply('God Bless! You will hear from me when someone has prayed for this. 😘')
      })
      .catch(err => {
        console.log(err)
        ctx.reply('An error has occurred.')
      })
    }
    else {
      ctx.answerCbQuery('Please fill in the request.')
    }
  },
  setParentMenuAfter: true,
})

// This is the page to view Prayers and to pray for them =================
const prayer_request_pray = new TelegrafInlineMenu(ctx => {
  let id = ctx.from.id
  let localItem = JSON.parse(localStorage.getItem(id))
  if (!ObjectHelper.isEmpty(localItem.groupsPrayerRequest)) {
    return `I'm so happy to see you here ${ctx.from.first_name} 😘, prayer is such an important part of any christian group. Please select one of the prayer request below to pray for. ❤️\n\nNote: The bracket beside is how many prayed for this request. A 👼 represents 3 and above. 💕`
  }
  else {
    return `Sorry there isn't any prayer request at the moment. Not sure if thats a good or bad thing! 🙈`
  }
})

const prayer_request_pray_confirmation = new TelegrafInlineMenu(ctx => {
  let id = ctx.from.id
  let localItem = JSON.parse(localStorage.getItem(id))
  let prayerId = ctx.match[1].toString()
  let prayerRequest = localItem.groupsPrayerRequest[prayerId]
  if (prayerRequest) {
    return `🙏 Prayer for ${prayerRequest.name} 🙏\n\n\n${prayerRequest.description}\n\n\nPlease spend a moment to pray on this matter, if you are busy please come back later! 🙏. If you have prayed for this, please confirm by clicking on the button below. ❤️`
  }
  else {
    return `Sorry, an error has occurred. Please try again.`
  }
})

prayer_request_pray.selectSubmenu('r', (ctx) => {
  let id = ctx.from.id
  let localItem = JSON.parse(localStorage.getItem(id))
  if (!ObjectHelper.isEmpty(localItem.groupsPrayerRequest)) {
    let prayerButtons = {}
    for (var key in localItem.groupsPrayerRequest) {
      if (localItem.groupsPrayerRequest.hasOwnProperty(key)) {
          let prayerCount = parseInt(localItem.groupsPrayerRequest[key].prayer_count ,10)
          let formattedPrayerCount = (prayerCount > 2) ? '👼' : prayerCount
          prayerButtons[key] = `[${formattedPrayerCount}] ${localItem.groupsPrayerRequest[key].name}'s 🙏 `
      }
    }
    return prayerButtons
  }
  else {
    return {}
  }
}, prayer_request_pray_confirmation, {columns: 2})

prayer_request_pray_confirmation.button('Finished Praying. 🥰', 'y', {
  doFunc: (ctx) => {
    return Prayer_Request
    .query()
    .where({id: ctx.match[1]})
    .then(([prayer_request]) => {
      let localItem = JSON.parse(localStorage.getItem(ctx.from.id))
      let { id } = localItem
      let { prayer_response } = prayer_request
      if (prayer_response[id]) {
        ctx.reply(`Thank you for praying about this again! 👍`)
      }
      else {
        prayer_response[id] = true
        let prayer_count = Object.keys(prayer_response).length
        return Prayer_Request
        .query()
        .patchAndFetchById(ctx.match[1], {prayer_count, prayer_response})
        .then(res => {
          localItem.groupsPrayerRequest[ctx.match[1]].prayer_count = prayer_count
          localStorage.setItem(ctx.from.id, JSON.stringify(localItem))
          ctx.reply('Thank you so much for taking the time to pray for this. 😘❤️')
          TelegramMessengerHelper.prayerRequest(ctx, res)
        })
      }
    })
    .catch(err => {
      console.log(err)
      ctx.reply('Error has occured.')
    })
  },
  setParentMenuAfter: true,
})
prayer_request_pray_confirmation.button("I'll pray about it later! 😣", 'n', {
  doFunc: (ctx) => {

  },
  joinLastRow: true,
  setParentMenuAfter: true
})

prayer_request.submenu('To Pray 🙏', 'p', prayer_request_pray)
prayer_request.submenu('To Be Prayed For 💞', 'r', prayer_request_request)

module.exports = {
  prayer_request,
  prayer_request_request,
  prayer_request_pray,
  prayer_request_pray_confirmation,
}
