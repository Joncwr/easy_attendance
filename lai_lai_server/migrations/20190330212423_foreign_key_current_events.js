
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('groups', t => {
    t.integer('current_event').references('events.id').alter()
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('groups', t => {
    t.string('current_event').alter()
  })
};
