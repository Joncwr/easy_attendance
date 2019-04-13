const { Model } = require('../../db')
const Attendance = require('../attendance')

class Events extends Model {
  static get tableName() {
    return 'events';
  }

  static get relationMappings () {
    return {
      attendance: {
        relation: Model.HasManyRelation,
        modelClass: Attendance,
        join: {
          from: 'events.id',
          to: 'attendance.event_id'
        }
      }
    }
  }
}

module.exports = Events;
