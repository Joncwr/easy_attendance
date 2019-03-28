require('dotenv').config()

const { Model } = require('objection')
const Knex = require('knex')

const knex = Knex({
  client: 'pg',
  connection: process.env.DATABASE_URL,
});

Model.knex(knex)

module.exports = {
  Model,
  knex
}
