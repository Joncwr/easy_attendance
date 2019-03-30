
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('users', t => {
      t.increments('id').primary()
      t.string('username').notNullable()
      t.string('password').notNullable()
      t.string('salt').notNullable()
      t.timestamps(false, true)
    }),
    knex.schema.createTable('groups', t => {
      t.increments('id').primary()
      t.string('group_name').notNullable()
      t.string('current_event').notNullable()
      t.timestamps(false, true)
    }),
    knex.schema.createTable('events', t => {
      t.increments('id').primary()
      t.string('name').notNullable()
      t.integer('group_id').references('groups.id')
      t.timestamps(false, true)
    }),
    knex.schema.createTable('attendance', t => {
      t.integer('attendee_id').references('attendees.id')
      t.integer('event_id').references('events.id')
      t.boolean('status').defaultTo(null)
    }),
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTableIfExists('attendance'),
    knex.schema.dropTableIfExists('events'),
    knex.schema.dropTableIfExists('groups'),
    knex.schema.dropTableIfExists('users'),
  ])
};
