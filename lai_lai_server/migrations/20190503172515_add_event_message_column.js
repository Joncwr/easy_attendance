
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('events', t => {
    t.string('message')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('events', t => {
    t.dropColumn('seen')
  })
};
