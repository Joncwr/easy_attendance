
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('events', t => {
    t.json('event_schema').defaultTo(null)
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('events', t => {
    t.dropColumn('event_schema')
  })
};
