const { Model } = require('../../db')

class Requested_Attendees extends Model {
  static get tableName() {
    return 'requested_attendees';
  }
}

module.exports = Requested_Attendees;
