const { Model } = require('../../db')

class Events extends Model {
  static get tableName() {
    return 'events';
  }
}

module.exports = Events;
