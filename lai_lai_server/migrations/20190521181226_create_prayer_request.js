
exports.up = function(knex, Promise) {
  return knex.schema.createTable('prayer_request', t => {
    t.increments('id').primary()
    t.string('description', 2000).notNullable()
    t.integer('attendee_id').references('attendees.id')
    t.integer('group_id').references('groups.id')
    t.integer('prayer_count').defaultTo(0)
    t.timestamp('created_at').defaultTo(knex.fn.now())
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('prayer_request')
};
