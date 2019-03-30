const { Model } = require('../../db')

class Users_Groups extends Model {
  static get tableName() {
    return 'users_groups';
  }
}

module.exports = Users_Groups;
