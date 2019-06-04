const TelegrafInlineMenu = require('telegraf-inline-menu')
const TelegramHelper = require('../../helpers/TelegramHelper')
const ObjectHelper = require('../../helpers/ObjectHelper')
const validator = require('validator')

const worshipsongs = new TelegrafInlineMenu(ctx =>
  { return getValue(ctx, 'menuText') },
  { photo: (ctx) => { return getValue(ctx, 'media') }
})

worshipsongs.simpleButton('Watch the video! 📺', 'yt', {
  doFunc: (ctx) => {
    if (validator.isURL(getValue(ctx, 'media'))) {
      ctx.reply(getValue(ctx, 'media'))
    }
    else {
      ctx.answerCbQuery('Not a valid URL. 😢')
    }
  },
  hide: (ctx) => {
    if (validator.isURL(getValue(ctx, 'media'))) return false
    else return true
  }
})

worshipsongs.simpleButton('Read the full sharing! 📑', 'ss', {
  doFunc: (ctx) => {
    let id = ctx.from.id
    let localItem = JSON.parse(localStorage.getItem(id))
    let { worshipSong } = localItem
    ctx.reply(`Short sharing:\n${worshipSong.text}`)
  },
  hide: (ctx) => {
    let id = ctx.from.id
    let localItem = JSON.parse(localStorage.getItem(id))
    let { worshipSong } = localItem
    let text = `Event: ${worshipSong.event_name}\n\nWho chose it: ${worshipSong.attendee_name}\n\nSong name: ${worshipSong.song_name}\n\nShort sharing:\n${worshipSong.text}`
    if (text.length > 1024) {
      return false
    }
    else return true
  }
})

function getValue(ctx, method) {
  let id = ctx.from.id
  let localItem = JSON.parse(localStorage.getItem(id))
  if (method === 'media') {
    if (!ObjectHelper.isEmpty(localItem.worshipSong.url)) {
      if (validator.isURL(localItem.worshipSong.url)) {
        return localItem.worshipSong.url
      }
      else return ''
    }
    else return ''
  }
  else if (method === 'menuText') {
    if (!ObjectHelper.isEmpty(localItem.worshipSong)) {
      let { worshipSong } = localItem
      let text = `Event: ${worshipSong.event_name}\n\nWho chose it: ${worshipSong.attendee_name}\n\nSong name: ${worshipSong.song_name}\n\nShort sharing:\n${worshipSong.text}`
      if (text.length > 1024) {
        let splitText = text.match(/(.|[\r\n]){1,978}/g)
        text = `${splitText[0]}...\n\nto read more click on the button below 😆`
        console.log(text.length);
      }
      return text
    }
    else {
      return 'No worship songs were recorded for this event yet.'
    }
  }
}

module.exports = {
  worshipsongs,
}
