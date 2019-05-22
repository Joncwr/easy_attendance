
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('prayer_request', t => {
    t.json('prayer_response')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('prayer_request', t => {
    t.dropColumn('prayer_response')
  })
};
