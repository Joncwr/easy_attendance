let checkOption = (event, eventOptions) => {
  let status
  eventOptions.forEach(data => {
    if (data.fieldName === event.fieldName) {
      status = data.value
    }
  })
  return status
}

module.exports = {
  getExtraOptions: (eventSchema, attendees) => {
    let extraOptions = []

    eventSchema.forEach(event => {
      let extraOptionsDict = {}
      let isValue1True = 0
      let isValue1False = 0

      attendees.forEach(data => {
        if (data.eventOptions) {
          if (data.status === "confirmed") {
            let status = checkOption(event, data.eventOptions)
            if (status) isValue1True ++
            else isValue1False ++
          }
          else isValue1False ++
        }
        else isValue1False ++
      })
      extraOptionsDict['value'] = event.fieldName
      extraOptionsDict['valueTrueCounter'] = isValue1True
      extraOptionsDict['valueFalseCounter'] = isValue1False

      extraOptions.push(extraOptionsDict)
    })

    return extraOptions
  },
}
