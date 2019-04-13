
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('users', t => {
    t.integer('default_group').defaultTo(0)
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('users', t => {
    t.dropColumn('default_group')
  })
};
