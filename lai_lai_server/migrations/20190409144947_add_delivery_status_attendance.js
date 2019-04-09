
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('attendance', t => {
    t.string('message_status').defaultTo(null)
    t.string('message_sid').defaultTo(null)
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('attendance', t => {
    t.dropColumn('message_status')
    t.dropColumn('message_sid')
  })
};
