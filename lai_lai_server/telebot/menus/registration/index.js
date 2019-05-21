const TelegrafInlineMenu = require('telegraf-inline-menu')
const TelegramHelper = require('../../helpers/TelegramHelper')
const { requestAddAttendee } = require('../../../routes/publicapi')

const registration = new TelegrafInlineMenu(ctx => {
  return getValue(ctx, 'menuText')
})

registration.question((ctx) => {
  return 'Enter You Name Here ❣️'
}, 'c1', {
  questionText: 'Please send us a reply of your name ☺️',
  setFunc: (ctx, answer) => {
    setValue(ctx, 'name', answer)
  },
})

registration.question((ctx) => {
  return 'Enter Your Number Here 😆'
}, 'c2', {
  questionText: 'Please send us a reply of your number ☺️',
  setFunc: (ctx, answer) => {
    setValue(ctx, 'number', answer)
  },
})

registration.question((ctx) => {
  return 'Enter Your Email (Optional) Here 🙈'
}, 'c3', {
  questionText: 'Please send us a reply of your email ☺️',
  setFunc: (ctx, answer) => {
    setValue(ctx, 'email', answer)
  },
})

registration.simpleButton('Confirm! 👊', 'cfm', {
  doFunc: (ctx) => {
    let telegramId = ctx.from.id
    let localReg = JSON.parse(localStorage.getItem('register'))
    let localItem = localReg[telegramId]
    if (localItem) {
      let { name, number, email, group_id } = localItem
      if (name === '' || number === '') {
        ctx.answerCbQuery('Please fill in at least your name and number 😭')
      }
      else {
        let telegram_id = parseInt(telegramId, 10)
        let attendeeDict = { name, number, email, group_id, telegram_id }
        requestAddAttendee(attendeeDict)
        .then(res => {
          delete localReg[telegramId]
          localStorage.setItem('register', JSON.stringify(localReg))
          ctx.deleteMessage()
          ctx.replyWithSticker('CAADBQADAQADH-QBK5v1jkw34ZM6Ag')
          ctx.reply(`Thank you so much for registering, please wait for the group leader's acceptance. 😍`)
        })
        .catch(err => {
          console.log(err)
          ctx.reply('Something went wrong, so sorry about this, but can you please register again through the link. 😭')
        })
      }
    }
    else {
      ctx.reply('Something went wrong, so sorry about this, but can you please register again through the link. 😭')
    }
  },
})

function getValue(ctx, method) {
  let id = ctx.from.id
  let localItem = JSON.parse(localStorage.getItem('register'))
  let { name, number, email } = localItem[id]
  if (method === 'menuText') {
    return `Good day to you ${ctx.from.first_name}! 😇\nI'm so glad that your here today to join the group! 💞\nPlease bare with this mandatory registration process and help us to fill up the information needed by clicking the buttons below to fill in each field. 🙏\n\nName: ${name}\nContact Number: ${number}\nEmail (Optional): ${email}`
  }
}

function setValue(ctx, method, answer) {
  let id = ctx.from.id
  let localItem = JSON.parse(localStorage.getItem('register'))
  if (method === 'name') localItem[id]['name'] = answer
  else if (method === 'number') localItem[id]['number'] = answer
  else if (method === 'email') localItem[id]['email'] = answer
  localStorage.setItem('register', JSON.stringify(localItem))
}

module.exports = {
  registration,
}
