const Attendees = require('../../models/attendees')
const Groups = require('../../models/groups')
const Telegram = require('telegraf/telegram')
const TelegramBot = new Telegram(process.env.TELEGRAM_BOT_TOKEN)

module.exports = {
  prayerRequest: (ctx, prayerRequest) => {
    return Attendees
    .query()
    .where({id: prayerRequest.attendee_id})
    .select('telegram_id')
    .then(([attendee]) => {
      let { telegram_id } = attendee
      TelegramBot.sendSticker(telegram_id, 'CAADBQADAwADH-QBK4PSHtYCLovsAg')
      TelegramBot.sendMessage(telegram_id, '🥰 God Bless! Someone in your group has just prayed for your prayer request! 🥰')
    })
  },
  broadcastPrayerRequest: (ctx, prayerId) => {
    let localItem = JSON.parse(localStorage.getItem(ctx.from.id))
    let { group_id } = localItem
    return Groups
    .query()
    .where({id: group_id})
    .eager('attendees(selectTelegram, telegramExists)')
    .then(([group]) => {
      let { attendees } = group
      attendees.forEach(attendee => {
        let { telegram_id } = attendee
        if (telegram_id.toString() !== ctx.from.id.toString()) {
          let inlineButton = [{
            text: '📝 Respond the prayer request! 💖',
            callback_data: 'inpr.' + prayerId
          }]
          TelegramBot.sendMessage(telegram_id, null, {
            text: '👼 Someone in your group just posted a prayer request! Please click on the link to pray for them! 🙏 ',
            reply_markup: { inline_keyboard: [inlineButton] }
          })
          .catch(err => {})
        }
      })
    })
    .catch(err => {
      console.log(err)
      ctx.reply('An error has occurred.')
    })
  }
}
