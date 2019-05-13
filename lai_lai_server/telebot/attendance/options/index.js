const TelegrafInlineMenu = require('telegraf-inline-menu')
const TelegramHelper = require('../../helpers/TelegramHelper')
const ObjectHelper = require('../../helpers/ObjectHelper')
const { attendanceApi } = require('../../../routes/publicapi')

const options = new TelegrafInlineMenu(ctx => {
  return 'Nice check out what options we have!'
})

let optionName = ['Option 1', 'Option 1', 'Option 3']
let commentName = ['Option 1', 'Option 2', 'Option 3']
let toggles = [false,false,false]

// Option 1 ===========================================
options.toggle((ctx) => {
  return getValue(ctx, 'toggleName', 0)
}, 'o1', {
  setFunc: (ctx, newState) => {
    setValue(ctx, 'toggle', 0, {setToggle: newState})
  },
  isSetFunc: (ctx) => {
    return getValue(ctx, 'toggle', 0)
  },
  hide: (ctx) => {
    return getHide(ctx, 'toggle', 0)
  }
})

options.question((ctx) => {
  return getValue(ctx, 'comments', 0)
}, 'c1', {
  questionText: 'Please just message us your answer now for - ' + commentName[0],
  setFunc: (ctx, answer) => {
    ctx.reply('Thanks! We have recorded your answer - ' + answer)
    console.log(ctx.match);
  },
  hide: (ctx) => {
    return getHide(ctx, 'comments', 0)
  }
})

let selectedKey = '2'
options.select('s1', ['1','2','3','4','5','6'], {
  setFunc: async (ctx, key) => {
    selectedKey = key
    await ctx.answerCbQuery(`you selected ${key}`)
  },
  multiselect: (_ctx, key) => key === selectedKey,
  hide: (ctx) => {return false},
  columns: 3,
})

// Option 2 ===========================================
options.toggle((ctx) => {
  return getValue(ctx, 'toggleName', 1)
}, 'o2', {
  setFunc: (ctx, newState) => {
    setValue(ctx, 'toggle', 1, {setToggle: newState})
  },
  isSetFunc: (ctx) => {
    return getValue(ctx, 'toggle', 1)
  },
  hide: (ctx) => {
    return getHide(ctx, 'toggle', 1)
  }
})

options.question((ctx) => {
  return getValue(ctx, 'comments', 1)
}, 'c2', {
  questionText: 'Please just message us your answer now for - ' + commentName[1],
  setFunc: (ctx, answer) => {
    ctx.reply('Thanks! We have recorded your answer - ' + answer)
    console.log(ctx.match);
  },
  hide: (ctx) => {
    return getHide(ctx, 'comments', 1)
  }
})

// Option 3 ===========================================
options.toggle((ctx) => {
  return getValue(ctx, 'toggleName', 2)
}, 'o3', {
  setFunc: (ctx, newState) => {
    setValue(ctx, 'toggle', 2, {setToggle: newState})
  },
  isSetFunc: (ctx) => {
    return getValue(ctx, 'toggle', 2)
  },
  hide: (ctx) => {
    return getHide(ctx, 'toggle', 2)
  }
})

options.question((ctx) => {
  return getValue(ctx, 'comments', 2)
}, 'c3', {
  questionText: 'Please just message us your answer now for - ' + commentName[2],
  setFunc: (ctx, answer) => {
    ctx.reply('Thanks! We have recorded your answer - ' + answer)
    console.log(ctx.match);
  },
  hide: (ctx) => {
    return getHide(ctx, 'comments', 2)
  }
})

function getValue(ctx, method, index) {
  let localItem = JSON.parse(localStorage.getItem(ctx.from.id))
  if (method === 'toggleName') {
    if (localItem.eventOptions[index]) {
      return localItem.eventOptions[index].fieldName || ''
    }
    else {
      return 'null'
    }
  }
  else if (method === 'toggle') {
    if (localItem.eventOptions[index]) {
      return localItem.eventOptions[index].value
    }
  }
  else if (method === 'comments') {
    if (localItem.eventOptions[index].type === 'comments' && localItem.eventOptions[index].extraFields) {
      return localItem.eventOptions[index].extraFields[0].name
    }
    else return 'null'
  }
}

function setValue(ctx, method, index, value) {
  let id = ctx.from.id
  let localItem = JSON.parse(localStorage.getItem(id))
  if (method === 'toggle') {
    if (localItem.eventOptions[index]) {
      localItem.eventOptions[index].value = value.setToggle
      localStorage.setItem(id, JSON.stringify(localItem))
      console.log(localItem.eventOptions[index].value, value);
    }
    else {
      return 'null'
    }
  }
  else if (method === 'comments') {
    if (localItem.eventOptions[index].type === 'comments' && localItem.eventOptions[index].extraFields) {
      return localItem.eventOptions[index].extraFields[0].name
    }
    else return 'null'
  }
}

function getHide(ctx, method, index) {
  let id = ctx.from.id
  let localItem = JSON.parse(localStorage.getItem(id))
  if (method === 'toggle') {
    if (localItem.eventOptions[index]) {
      return false
    }
    else return true
  }
  else if (method === 'comments') {
    if (localItem.eventOptions[index]) {
      if (localItem.eventOptions[index].value) {
        if (localItem.eventOptions[index].type === 'comments' && localItem.eventOptions[index].extraFields) {
          return false
        }
        else return true
      }
      else return true
    }
    else return true
  }
}

options.manual('Confirm', 'done')

module.exports = {
  options
}
