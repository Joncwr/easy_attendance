
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('attendees', t => {
    t.string('name').notNullable().alter()
    t.string('number').notNullable().alter()
    t.boolean('attending')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('attendees', t => {
    t.string('name').alter()
    t.string('number').alter()
    t.dropColumn('attending')
  })
};
