
exports.up = function(knex, Promise) {
  return knex.schema.createTable('requested_attendees', t => {
    t.increments('id').primary()
    t.string('name').notNullable()
    t.string('number').notNullable()
    t.string('email').notNullable()
    t.integer('group_id').references('groups.id')
    t.timestamp('created_at').defaultTo(knex.fn.now())
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('requested_attendees')
};
