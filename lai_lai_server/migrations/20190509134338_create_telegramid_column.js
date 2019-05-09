
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('attendees', t => {
    t.string('telegram_id')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('attendees', t => {
    t.dropColumn('telegram_id')
  })
};
