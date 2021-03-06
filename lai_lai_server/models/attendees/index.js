const { Model } = require('../../db')
const Groups = require('../groups')
const Attendance = require('../attendance')

class Attendees extends Model {
  static get tableName() {
    return 'attendees';
  }
  static get modifiers() {
    return {
      telegramExists(builder) {
        builder.whereNotNull('telegram_id');
      },
      selectName(builder) {
        builder.select('name')
      },
      selectTelegram(builder) {
        builder.select('telegram_id')
      },
    };
  }
  static get relationMappings () {
    return {
      groups: {
        relation: Model.ManyToManyRelation,
        modelClass: Groups,
        join: {
          from: 'attendees.id',
          through: {
            from: 'attendees_groups.attendee_id',
            to: 'attendees_groups.group_id'
          },
          to: 'groups.id'
        }
      },
      attendance: {
        relation: Model.HasManyRelation,
        modelClass: Attendance,
        join: {
          from: 'attendees.id',
          to: 'attendance.attendee_id'
        }
      },
      testimonials: {
        relation: Model.HasManyRelation,
        modelClass: require('../testimonials'),
        join: {
          from: 'attendees.id',
          to: 'testimonials.attendee_id'
        }
      }
    }
  }
}

module.exports = Attendees;
