
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('testimonials', t => {
    t.integer('group_id').references('groups.id')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('testimonials', t => {
    t.dropColumn('group_id')
  })
};
