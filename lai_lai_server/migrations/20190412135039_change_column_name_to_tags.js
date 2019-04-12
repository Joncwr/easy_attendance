
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('attendance', t => {
    t.renameColumn('extra_comments', 'tags')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('attendance', t => {
    t.renameColumn('tags', 'extra_comments')
  })
};
