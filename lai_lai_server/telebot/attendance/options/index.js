const TelegrafInlineMenu = require('telegraf-inline-menu')
const TelegramHelper = require('../../helper/TelegramHelper')
const { attendanceApi } = require('../../../routes/publicapi')

const options = new TelegrafInlineMenu(ctx => {
  return 'Nice check out what options we have!'
})

let optionName = ['Option 1', 'Option 1', 'Option 3']
let commentName = ['Comment 1', 'Comment 1', 'Comment 3']
let toggles = [false,false,false]

options.toggle((ctx) => {
  return getValue(ctx, 'toggle', 0)
}, 'o1', {
  setFunc: (ctx, newState) => {
    toggles[0] = newState
  },
  isSetFunc: (ctx) => {
    return toggles[0]
  },
  hide: (ctx) => {
    return false
  }
})

options.question((ctx) => {
  return 'hihi'
}, 'c1', {
  questionText: 'Please just message us your answer now for - ' + commentName[0],
  setFunc: (ctx, answer) => {
    ctx.reply('Thanks! We have recorded your answer - ' + answer)
    console.log(ctx.match);
  },
  hide: (ctx) => {
    return false
  }
})

options.toggle((ctx) => {
  return getValue(ctx, 'toggle', 1)
}, 'o2', {
  setFunc: (ctx, newState) => {
    toggles[1] = newState
  },
  isSetFunc: (ctx) => {
    return toggles[1]
  },
  hide: (ctx) => {
    return false
  }
})

options.toggle((ctx) => {
  return getValue(ctx, 'toggle', 2)
}, 'o3', {
  setFunc: (ctx, newState) => {
    toggles[2] = newState
  },
  isSetFunc: (ctx) => {
    return toggles[2]
  },
  hide: (ctx) => {
    return false
  }
})

function getValue(ctx, method, index) {
  let localItem = JSON.parse(localStorage.getItem(ctx.from.id))
  if (method === 'toggle') {
    if (localItem.eventOptions[index]) {
      return localItem.eventOptions[index].fieldName || ''
    }
    else {
      return 'null'
    }
  }
  else  if (methog === 'comments') {

  }
}

function setOptionsMenuVariables(optionNameParams) {
  optionName = ['lol', 'lol', 'lol']
}

module.exports = {
  options,
  setOptionsMenuVariables,
}
