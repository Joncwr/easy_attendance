
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('attendance', t => {
    t.specificType('tags', 'jsonb[]').alter()
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('attendance', t => {
    t.string('tags').alter()
  })
};
