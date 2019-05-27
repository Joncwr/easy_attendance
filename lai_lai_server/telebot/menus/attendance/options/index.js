const TelegrafInlineMenu = require('telegraf-inline-menu')
const TelegramHelper = require('../../../helpers/TelegramHelper')
const ObjectHelper = require('../../../helpers/ObjectHelper')
const { attendanceApi } = require('../../../../routes/publicapi')

const options = new TelegrafInlineMenu(async (ctx) => {
  return getValue(ctx, 'menuText')
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
    setValue(ctx, 'comments', 0, {answer})
  },
  hide: (ctx) => {
    return getHide(ctx, 'comments', 0)
  }
})

options.select('s1', (ctx) => getValue(ctx, 'selectName', 0), {
  setFunc: async (ctx, key) => {
    setValue(ctx, 'select', 0, {key})
  },
  isSetFunc: (ctx, key) => {
    return getValue(ctx, 'select', 0, {key})
  },
  hide: (ctx) => {
    return getHide(ctx, 'select', 0)
  },
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
    setValue(ctx, 'comments', 1, {answer})
  },
  hide: (ctx) => {
    return getHide(ctx, 'comments', 1)
  }
})

options.select('s2', (ctx) => getValue(ctx, 'selectName', 1), {
  setFunc: async (ctx, key) => {
    setValue(ctx, 'select', 1, {key})
  },
  isSetFunc: (ctx, key) => {
    return getValue(ctx, 'select', 1, {key})
  },
  hide: (ctx) => {
    return getHide(ctx, 'select', 1)
  },
  columns: 3,
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
    setValue(ctx, 'comments', 2, {answer})
  },
  hide: (ctx) => {
    return getHide(ctx, 'comments', 2)
  }
})

options.select('s3', (ctx) => getValue(ctx, 'selectName', 2), {
  setFunc: async (ctx, key) => {
    setValue(ctx, 'select', 2, {key})
  },
  isSetFunc: (ctx, key) => {
    return getValue(ctx, 'select', 2, {key})
  },
  hide: (ctx) => {
    return getHide(ctx, 'select', 2)
  },
  columns: 3,
})

// Functions ===============================
function getValue(ctx, method, index, value) {
  let localItem = JSON.parse(localStorage.getItem(ctx.from.id))
  if (method === 'menuText') {
    if (localItem.eventOptions) {
      let eventOptions = Object.assign([], localItem.eventOptions)
      let eventOptionMessage = 'Your current choices..\n'
      eventOptions.forEach(data => {
        let status = (data.value) ? 'Yes! 🥰' : 'No thanks... 😥'
        eventOptionMessage = eventOptionMessage + `${data.fieldName}: ${status}\n`
      })
      return `Super excites your coming! 🤩 Check out what options we have on that day 🤔\n\n${eventOptionMessage}`
    }
    else {
      return `Super excites your coming! 🤩 Check out what options we have on that day 🤔`
    }
  }
  else if (method === 'toggleName') {
    if (localItem.eventOptions[index]) {
      let status = (localItem.eventOptions[index].value) ? 'Yes' : 'No'
      return `${localItem.eventOptions[index].fieldName}: Current Choice ( ${status} )` || ''
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
      if (localItem.eventOptions[index].extraFields[0].comment !== '') {
        return localItem.eventOptions[index].extraFields[0].name + ' (Response recorded! 😘)'
      }
      else {
        return localItem.eventOptions[index].extraFields[0].name + ' (Click to respond 🙃)'
      }
    }
    else return 'null'
  }
  else if (method === 'selectName') {
    if (localItem.eventOptions[index]) {
      if (localItem.eventOptions[index].type === 'multi' && localItem.eventOptions[index].extraFields) {
        let options = {}
        localItem.eventOptions[index].extraFields.forEach((data,index)=> {
          let status = (data.value) ? 'Yes Please!' : 'No thanks!'
          options[index] = data.name + ': ' + status || ''
        })
        return options
      }
      else return []
    }
    else return []
  }
  else if (method === 'select') {
    if (localItem.eventOptions[index].type === 'multi' && localItem.eventOptions[index].extraFields) {
      return localItem.eventOptions[index].extraFields[value.key].value
    }
    else return false
  }
}

function setValue(ctx, method, index, value) {
  let id = ctx.from.id
  let localItem = JSON.parse(localStorage.getItem(id))
  if (method === 'toggle') {
    if (localItem.eventOptions[index]) {
      localItem.eventOptions[index].value = value.setToggle
      localStorage.setItem(id, JSON.stringify(localItem))
    }
  }
  else if (method === 'comments') {
    if (localItem.eventOptions[index].type === 'comments' && localItem.eventOptions[index].extraFields) {
      localItem.eventOptions[index].extraFields[0].comment = value.answer
      localStorage.setItem(id, JSON.stringify(localItem))
      ctx.reply('Thanks! We have recorded your answer - ' + value.answer)
    }
  }
  else if (method === 'select') {
    if (localItem.eventOptions[index].type === 'multi' && localItem.eventOptions[index].extraFields) {
      localItem.eventOptions[index].extraFields[value.key].value = !localItem.eventOptions[index].extraFields[value.key].value
      localStorage.setItem(id, JSON.stringify(localItem))
    }
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
  else if (method === 'select') {
    if (localItem.eventOptions[index]) {
      if (localItem.eventOptions[index].value) {
        if (localItem.eventOptions[index].type === 'multi' && localItem.eventOptions[index].extraFields) {
          return false
        }
        else return true
      }
      else return true
    }
    else return true
  }
}

options.manual('Once your done selecting, Click Here! 😍', 'done')

module.exports = {
  options
}
