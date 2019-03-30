
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('users_groups', t => {
    t.increments('id').primary()
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('users_groups', t => {
    t.dropColumn('id')
  })
};
