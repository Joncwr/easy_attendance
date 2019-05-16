
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('requested_attendees', t => {
    t.integer('telegram_id')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('requested_attendees', t => {
    t.dropColumn('telegram_id')
  })
};
