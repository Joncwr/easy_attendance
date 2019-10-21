
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('groups', t => {
    t.integer('song_picker').references('attendees.id')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('groups', t => {
    t.dropColumn('song_picker')
  })
};
