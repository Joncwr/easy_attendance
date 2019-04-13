
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.alterTable('attendance', t => {
      t.json('conditions').defaultTo(null)
      t.string('extra_comments').defaultTo(null)
    }),
    knex.schema.alterTable('events', t => {
      t.boolean('closed').defaultTo(false)
    }),
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.alterTable('attendance', t => {
      t.dropColumn('conditions')
      t.dropColumn('extra_comments')
    }),
    knex.schema.alterTable('events', t => {
      t.dropColumn('closed')
    }),
  ])
};
