
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('users_groups', t => {
      t.integer('user_id').references('users.id')
      t.integer('group_id').references('groups.id')
    }),
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTableIfExists('users_groups'),
  ])
};
