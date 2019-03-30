const express = require('express')
const router = express.Router()

const Groups = require('../../models/groups')
const Users_Groups = require('../../models/users_groups')

router.post('/createGroup', (req, res) => {
  const { group_name, user_id } = req.body
  return Groups
    .query()
    .insert({group_name})
    .then(group => {
      return Users_Groups
      .query()
      .insert({
        user_id,
        group_id: group.id
      })
      .then(users_groups => {
        res.send({
          group,
          users_groups
        })
      })
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(400)
    })
});

module.exports = router
