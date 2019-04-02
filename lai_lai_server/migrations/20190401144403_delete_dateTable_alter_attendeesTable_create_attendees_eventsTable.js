
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTableIfExists('date'),
    knex.schema.alterTable('attendees', t => {
      t.dropColumn('attending')
      t.string('email')
    }),
    knex.schema.alterTable('attendance', t => {
      t.increments('id').primary()
    }),
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('date', t => {
      t.increments('id').primary()
      t.string('date').notNullable()
    }),
    knex.schema.alterTable('attendees', t => {
      t.boolean('attending')
      t.dropColumn('email')
    }),
    knex.schema.alterTable('attendance', t => {
    t.dropColumn('id')
    }),
  ])
};
