const TelegrafInlineMenu = require('telegraf-inline-menu')
const TelegramHelper = require('../../helpers/TelegramHelper')
const ObjectHelper = require('../../helpers/ObjectHelper')
const { addWorshipSong } = require('../../../routes/publicapi')
const Attendees = require('../../../models/attendees')

const sendworshipsongs = new TelegrafInlineMenu(ctx => {
  return getValue(ctx, 'menuText')
})

sendworshipsongs.question((ctx) => {
  return 'Enter Song Name Here ☺️'
}, 'c1', {
  questionText: 'Please send us a reply of the song name ☺️',
  setFunc: (ctx, answer) => {
    setValue(ctx, 'songName', answer)
  },
})

sendworshipsongs.question((ctx) => {
  return 'Enter URL Link Here ☺️'
}, 'c2', {
  questionText: 'Please send us a reply of the songs URL link ☺️',
  setFunc: (ctx, answer) => {
    setValue(ctx, 'url', answer)
  },
})

sendworshipsongs.question((ctx) => {
  return 'Enter Short Sharing Here ☺️'
}, 'c3', {
  questionText: 'Please send us a reply of a short sharing ☺️',
  setFunc: (ctx, answer) => {
    setValue(ctx, 'text', answer)
  },
})

sendworshipsongs.simpleButton('Confirm! 👊', 'cfm', {
  doFunc: (ctx) => {
    let telegramId = ctx.from.id
    let localItem = JSON.parse(localStorage.getItem(telegramId))
    let { event_id, song_name, text, url } = localItem.worshipSongDedication
    if (song_name === '' || text === '' || url === '') {
      ctx.answerCbQuery('Please fill in all fields 😭')
    }
    else {
      return Attendees
      .query()
      .where({id: localItem.id})
      .then(([res]) => {
        let worship_song = { song_name, text, url, attendee_id: localItem.id, attendee_name: res.name }
        addWorshipSong(event_id, worship_song)
        .then(res => {
          TelegramHelper.endMenuConvo(ctx, 'happy')
        })
      })
      .catch(err => {
        console.log(err)
        ctx.reply('An error has occurred.')
      })
    }
  },
})

function getValue(ctx, method) {
  let id = ctx.from.id
  let localItem = JSON.parse(localStorage.getItem(id))
  if (method === 'menuText') {
    if (!ObjectHelper.isEmpty(localItem.worshipSongDedication)) {
      let { worshipSongDedication } = localItem
      return `ATTENDTION!!! Some URLs are abit buggy, try to paste the URL first, if you have an error, please click on the link sent to you again to come back here. Thank you!\n\nPlease click on the following buttons to fill in the following fields\n\nName of song: ${worshipSongDedication.song_name}\nSong URL link: ${worshipSongDedication.url}\nShort sharing: ${worshipSongDedication.text}`
    }
    else return 'Sorry the event was not found or has been closed'
  }
}

function setValue(ctx, method, answer) {
  let id = ctx.from.id
  let localItem = JSON.parse(localStorage.getItem(id))
  if (!ObjectHelper.isEmpty(localItem.worshipSongDedication)) {
    let { worshipSongDedication } = localItem
    if (method === 'songName') {
      worshipSongDedication['song_name'] = answer
    }
    else if (method === 'url') {
      worshipSongDedication['url'] = answer
    }
    else if (method === 'text') {
      worshipSongDedication['text'] = answer
    }
  }
  localStorage.setItem(ctx.from.id, JSON.stringify(localItem))
}

module.exports = {
  sendworshipsongs,
}
