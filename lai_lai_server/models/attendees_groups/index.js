const { Model } = require('../../db')
const Attendees = require('../attendees')

class Attendees_Groups extends Model {
  static get tableName() {
    return 'attendees_groups';
  }
  static get relationMappings () {
    return {
      attendees: {
        relation: Model.BelongsToOneRelation,
        modelClass: Attendees,
        join: {
          from: 'attendees_groups.attendee_id',
          to: 'attendees.id'
        }
      }
    }
  }
}

module.exports = Attendees_Groups;
