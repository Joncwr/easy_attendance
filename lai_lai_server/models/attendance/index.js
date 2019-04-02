const { Model } = require('../../db')

class Attendance extends Model {
  static get tableName() {
    return 'attendance';
  }
}

module.exports = Attendance;
