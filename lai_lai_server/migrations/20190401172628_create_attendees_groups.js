
exports.up = function(knex, Promise) {
  return knex.schema.createTable('attendees_groups', t => {
    t.increments('id').primary()
    t.integer('attendee_id').references('attendees.id')
    t.integer('group_id').references('groups.id')
    t.unique(['attendee_id', 'group_id'])
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('attendees_groups')
};
