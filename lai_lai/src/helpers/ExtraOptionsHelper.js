const ObjectHelper = require('./ObjectHelper')

let checkOption = (event, eventOptions) => {
  let status
  eventOptions.forEach(data => {
    if (data.fieldName === event.fieldName) {
      status = data.value
    }
  })
  return status
}

let checkType = (event, eventOptions) => {
  let type
  eventOptions.forEach(data => {
    if (data.fieldName === event.fieldName) {
      type = data.type
    }
  })
  return type
}

module.exports = {
  getExtraOptions: (eventSchema, attendees) => {
    let extraOptions = []

    eventSchema.forEach(event => {
      let extraOptionsDict = {}
      let isValue1True = 0
      let isValue1False = 0
      let type = null

      attendees.forEach(data => {
        if (data.eventOptions) {
          if (data.status === "confirmed") {
            let status = checkOption(event, data.eventOptions)
            type = checkType(event, data.eventOptions)
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
      extraOptionsDict['type'] = type

      extraOptions.push(extraOptionsDict)
    })

    return extraOptions
  },

  getSubfieldSummary: (attendees, fieldName) => {
    let subfieldSummary = {}
    attendees.forEach(attendeesData => {
      if (attendeesData.eventOptions) {
        let eventOptions = Object.assign([], attendeesData.eventOptions)
        if (eventOptions.length > 0) {
          eventOptions.forEach(eventOptionsData => {
            if (eventOptionsData.fieldName === fieldName) {
              if (eventOptionsData.extraFields) {
                let subfields = Object.assign([], eventOptionsData.extraFields)
                if (subfields.length > 0) {
                  subfields.forEach(subfieldData => {
                    if (subfieldData.value) {
                      if (!subfieldSummary[subfieldData.name]) {
                        subfieldSummary[subfieldData.name] = 1
                      }
                      else {
                        subfieldSummary[subfieldData.name] ++
                      }
                    }
                  })
                }
              }
            }
          })
        }
      }
    })

    if (!ObjectHelper.isEmpty(subfieldSummary)) return subfieldSummary
  },

  getCommentsSummary: (attendees, index) => {
    let commentsSummary = {}
    attendees.forEach(attendeesData => {
      if (attendeesData.eventOptions) {
        let eventOptions = Object.assign([], attendeesData.eventOptions)
        if (eventOptions.length > 0) {
          if (eventOptions[index].extraFields) {
            if (eventOptions[index].value) {
              let subfields = Object.assign([], eventOptions[index].extraFields)
              if (subfields.length > 0) {
                commentsSummary[attendeesData.id] = {}
                commentsSummary[attendeesData.id]['name'] = attendeesData.name
                commentsSummary[attendeesData.id]['number'] = attendeesData.number
                commentsSummary[attendeesData.id]['comments'] = []
                subfields.forEach(data => {
                  commentsSummary[attendeesData.id]['comments'].push(data)
                })
              }
            }
          }
        }
      }
    })

    if (!ObjectHelper.isEmpty(commentsSummary)) return commentsSummary
  },
}
