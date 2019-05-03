
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('testimonials', t => {
    t.boolean('seen').defaultTo(false)
    t.string('testimonial', 1000).alter()
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('testimonials', t => {
    t.dropColumn('seen')
    t.string('testimonial').alter()
  })
};
