const { Model } = require('../../db')
const Groups = require('../groups')

class Users extends Model {
  static get tableName() {
    return 'users';
  }

  static get relationMappings () {
    return {
      groups: {
        relation: Model.ManyToManyRelation,
        modelClass: Groups,
        join: {
          from: 'users.id',
          through: {
            from: 'users_groups.user_id',
            to: 'users_groups.group_id'
          },
          to: 'groups.id'
        }
      }
    }
  }
}

module.exports = Users;
