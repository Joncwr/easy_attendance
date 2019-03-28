const { Model } = require('../../db')

class Attendees extends Model {
  static get tableName() {
    return 'attendees';
  }
}

module.exports = Attendees;
