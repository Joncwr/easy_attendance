const { Model } = require('../../db')

const Events = require('../../models/events')

class Groups extends Model {
  static get tableName() {
    return 'groups';
  }
  static get relationMappings () {
    return {
      events: {
        relation: Model.BelongsToOneRelation,
        modelClass: Events,
        join: {
          from: 'groups.current_event',
          to: 'events.id'
        }
      },

      attendees: {
        relation: Model.ManyToManyRelation,
        modelClass: require('../../models/attendees'),
        join: {
          from: 'groups.id',
          through: {
            from: 'attendees_groups.group_id',
            to: 'attendees_groups.attendee_id'
          },
          to: 'attendees.id'
        }
      }
    }
  }
}

module.exports = Groups;
