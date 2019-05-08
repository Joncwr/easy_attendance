const TelegrafInlineMenu = require('telegraf-inline-menu')

const attendance = new TelegrafInlineMenu(ctx => {
  return `Hey ${ctx.from.first_name}!`
})

attendance.setCommand('attendance')

attendance.button('Attendance Button', 'aa', {
  doFunc: ctx => {
    ctx.reply('As am I!')
  },
  setParentMenuAfter: true,
})

module.exports = attendance
