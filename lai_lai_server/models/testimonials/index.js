const { Model } = require('../../db')

class Testimonials extends Model {
  static get tableName() {
    return 'testimonials';
  }
  static get modifiers() {
    return {
      orderByDate(builder) {
        builder.orderBy('created_at', 'desc');
      },
      getSeen(builder) {
        builder.where('seen', '=', true);
      },
      getNotSeen(builder) {
        builder.where('seen', '=', false);
      }
    };
  }
}

module.exports = Testimonials;
