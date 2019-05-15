
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('events', t => {
    t.json('worship_song')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('events', t => {
    t.dropColumn('worship_song')
  })
};
