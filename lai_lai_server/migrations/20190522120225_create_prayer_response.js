
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('prayer_request', t => {
    t.json('prayer_response').defaultTo('{}')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('prayer_request', t => {
    t.dropColumn('prayer_response')
  })
};
