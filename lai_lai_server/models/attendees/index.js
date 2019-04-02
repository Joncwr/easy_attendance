const { Model } = require('../../db')
const Groups = require('../groups')

class Attendees extends Model {
  static get tableName() {
    return 'attendees';
  }

  static get relationMappings () {
    return {
      groups: {
        relation: Model.ManyToManyRelation,
        modelClass: Groups,
        join: {
          from: 'attendees.id',
          through: {
            from: 'attendees_groups.attendee_id',
            to: 'attendees_groups.group_id'
          },
          to: 'groups.id'
        }
      }
    }
  }
}

module.exports = Attendees;
