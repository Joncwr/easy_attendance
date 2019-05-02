
exports.up = function(knex, Promise) {
  return knex.schema.createTable('testimonials', t => {
    t.increments('id').primary()
    t.string('testimonial').notNullable()
    t.integer('attendee_id').references('attendees.id')
    t.timestamp('created_at').defaultTo(knex.fn.now())
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('testimonials')
};
