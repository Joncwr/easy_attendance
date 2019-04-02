const { Model } = require('../../db')

class Attendees_Groups extends Model {
  static get tableName() {
    return 'attendees_groups';
  }
}

module.exports = Attendees_Groups;
