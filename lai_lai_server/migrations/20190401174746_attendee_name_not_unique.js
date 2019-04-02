
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('attendees', t => {
    t.dropUnique('name')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('attendees', t => {
    t.unique('name')
  })
};
