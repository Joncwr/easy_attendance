
exports.up = function(knex, Promise) {
  return knex.schema.createTable('date', t => {
    t.increments('id').primary()
    t.string('date').notNullable()
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('date')
};
