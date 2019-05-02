const { Model } = require('../../db')

class Testimonials extends Model {
  static get tableName() {
    return 'testimonials';
  }
}

module.exports = Testimonials;
