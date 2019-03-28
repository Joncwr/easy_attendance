
exports.up = function(knex, Promise) {
  return knex.schema.table('attendees', t => {
    t.string('number')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('attendees', t => {
    t.dropColumn('number')
  })
};
