const { Model } = require('../../db')

class Attendance extends Model {
  static get tableName() {
    return 'attendance';
  }

  static get relationMappings () {
    const Attendees = require('../attendees')
    return {
      attendees: {
        relation: Model.BelongsToOneRelation,
        modelClass: Attendees,
        join: {
          from: 'attendance.attendee_id',
          to: 'attendees.id'
        }
      }
    }
  }
}

module.exports = Attendance;
