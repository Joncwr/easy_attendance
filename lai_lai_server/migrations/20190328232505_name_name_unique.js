
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('attendees', t => {
    t.string('name').unique().alter()
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('attendees', t => {
    t.string('name').alter()
  })
};
