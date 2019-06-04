const TelegrafInlineMenu = require('telegraf-inline-menu')
const TelegramHelper = require('../../helpers/TelegramHelper')
const ObjectHelper = require('../../helpers/ObjectHelper')
const validator = require('validator')

const summarynotes = new TelegrafInlineMenu(ctx => {
  return 'Please select the date you want the summary from! 😆'
})

const summarynotesdate = new TelegrafInlineMenu(ctx => {
  let eventIndex = ctx.match[1]
  return getValue(ctx, 'menuText', eventIndex)
},
{
  photo: (ctx) => { return getValue(ctx, 'media', ctx.match[1]) }
})

summarynotesdate.simpleButton('Read the full sharing! 📑', 'ss', {
  doFunc: (ctx) => {
    let id = ctx.from.id
    let localItem = JSON.parse(localStorage.getItem(id))
    let { worshipSong } = localItem
    ctx.reply(`Short sharing:\n${worshipSong.text}`)
  },
  hide: (ctx) => {
    let id = ctx.from.id
    let localItem = JSON.parse(localStorage.getItem(id))
    let eventIndex = ctx.match[1]
    let { worship_song, summary_notes } = localItem.summarynotes[eventIndex]
    let text = `Event: ${localItem.summarynotes[eventIndex].name}\n\nWho chose it: ${worship_song.attendee_name}\n\nSong name: ${worship_song.song_name}\n\nShort sharing:\n${worship_song.text}\n\nPlease also download the summary notes from the link in the button below 🤗`
    if (text.length > 1024) {
      return false
    }
    else return true
  }
})

summarynotesdate.simpleButton('Watch the video! 📺', 'yt', {
  doFunc: (ctx) => {
    if (validator.isURL(getValue(ctx, 'media', ctx.match[1]))) {
      ctx.reply(getValue(ctx, 'media', ctx.match[1]))
    }
    else {
      ctx.answerCbQuery('Not a valid URL. 😢')
    }
  },
  hide: (ctx) => {
    if (validator.isURL(getValue(ctx, 'media', ctx.match[1]))) return false
    else return true
  }
})

summarynotesdate.simpleButton('Download Summary Notes! 👨‍🎓', 'd', {
  doFunc: (ctx) => {
    ctx.reply(getValue(ctx, 'summaryUrl', ctx.match[1]))
  },
})

function getValue(ctx, method, value) {
  let id = ctx.from.id
  let localItem = JSON.parse(localStorage.getItem(id))
  if (method === 'menuText') {
    let { worship_song, summary_notes } = localItem.summarynotes[value]
    let worshipSongSummary
    if ( worship_song ) {
      let text = `Event: ${localItem.summarynotes[value].name}\n\nWho chose it: ${worship_song.attendee_name}\n\nSong name: ${worship_song.song_name}\n\nShort sharing:\n${worship_song.text}\n\nPlease also download the summary notes from the link in the button below 🤗`
      if (text.length > 1024) {
        let splitText = text.match(/(.|[\r\n]){1,978}/g)
        worshipSongSummary = `${splitText[0]}...\n\nto read more click on the button below 😆`
      }
      else worshipSongSummary = text
    }
    if (worshipSongSummary) {
      return worshipSongSummary
    }
    else {
      return 'Please download the summary notes from the link in the button below 🤗'
    }
  }
  else if (method === 'media') {
    if (!ObjectHelper.isEmpty(localItem.summarynotes[value].worship_song)) {
      if (validator.isURL(localItem.summarynotes[value].worship_song.url)) {
        return localItem.summarynotes[value].worship_song.url
      }
      else return ''
    }
    else return ''
  }
  else if (method === 'summaryUrl') {
    if (!ObjectHelper.isEmpty(localItem.summarynotes[value].summary_notes)) {
      return localItem.summarynotes[value].summary_notes.url
    }
    else {
      ctx.reply('An error has occurred.')
    }
  }
}

function getSummaryDates(ctx) {
  let id = ctx.from.id
  let localItem = JSON.parse(localStorage.getItem(id))
  let renderButton = {}
  localItem.summarynotes.forEach((data,index) => {
    renderButton[index] = '🗓 ' + data.name
  })

  return renderButton
}

summarynotes.selectSubmenu('e', (ctx) => getSummaryDates(ctx), summarynotesdate, {
  columns: 3
})

module.exports = {
  summarynotes,
  summarynotesdate
}
