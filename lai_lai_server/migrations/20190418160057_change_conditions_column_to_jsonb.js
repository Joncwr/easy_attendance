
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.alterTable('attendance', t => {
      t.dropColumn('conditions')
    }),
    knex.schema.alterTable('attendance', t => {
      t.specificType('conditions', 'jsonb[]')
    })
  ])
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('attendance', t => {
    t.json('conditions').alter()
  })
};
