const { Model } = require('../../db')

class Date extends Model {
  static get tableName() {
    return 'date';
  }
}

module.exports = Date;
