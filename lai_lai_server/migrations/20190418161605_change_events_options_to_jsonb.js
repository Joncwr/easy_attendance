
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.alterTable('events', t => {
      t.dropColumn('event_schema')
    }),
    knex.schema.alterTable('events', t => {
      t.specificType('event_schema', 'jsonb[]')
    })
  ])
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('events', t => {
    t.json('event_schema').alter()
  })
};
