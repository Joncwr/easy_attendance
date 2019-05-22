const { Model } = require('../../db')

class Prayer_Request extends Model {
  static get tableName() {
    return 'prayer_request';
  }
  static get relationMappings () {
    return {
      attendees: {
        relation: Model.BelongsToOneRelation,
        modelClass: require('../attendees'),
        join: {
          from: 'prayer_request.attendee_id',
          to: 'attendees.id'
        }
      }
    }
  }
}

module.exports = Prayer_Request;
