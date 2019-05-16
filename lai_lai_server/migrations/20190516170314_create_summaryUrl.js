
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('events', t => {
    t.json('summary_notes')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('events', t => {
    t.dropColumn('summary_notes')
  })
};
