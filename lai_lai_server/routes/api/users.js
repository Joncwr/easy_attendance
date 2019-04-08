const express = require('express')
const router = express.Router()

const Users = require('../../models/users')
const Users_Groups = require('../../models/users_groups')

router.get('/getUser/:user_id', (req, res) => {
  const { user_id } = req.params
  return Users
    .query()
    .where({ id: user_id })
    .eager('groups.events')
    .then(user => {
      res.send(user)
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(400)
    })
});

router.get('/getUsers', (req, res) => {
  return Users
    .query()
    .then(users => {
      res.send(users)
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(400)
    })
});

router.put('/setDefaultGroup', (req, res) => {
  const { group_id, user_id } = req.body
  return Users
    .query()
    .patchAndFetchById(user_id, {default_group: group_id})
    .then(users => {
      res.send(users)
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(400)
    })
});

module.exports = router
