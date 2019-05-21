const { Model } = require('../../db')

class Prayer_Request extends Model {
  static get tableName() {
    return 'prayer_request';
  }
}

module.exports = Prayer_Request;
