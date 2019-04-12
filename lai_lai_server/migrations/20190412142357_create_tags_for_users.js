
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('users', t => {
    t.specificType('tags', 'jsonb[]')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('users', t => {
    t.dropColumn('tags')
  })
};
