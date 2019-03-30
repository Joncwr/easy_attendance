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
      }
    }
  }
}

module.exports = Groups;
