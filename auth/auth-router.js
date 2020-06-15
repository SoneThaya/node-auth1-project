const bcryptjs = require('bcryptjs')
const router = require("express").Router();

const Users = require("../users/users-model.js");
const usersModel = require('../users/users-model.js');

router.post("/register", (req, res) => {
  // validate the body, to make sure there is a username and password

  const { username, password } = req.body;

  // hash user password
  const rounds = process.env.HASH_ROUNDS || 8; // change to a higher number in production
  const hash = bcryptjs.hashSync(password, rounds)

  Users.add({username, password: hash})
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => res.send(err));
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  Users.findBy({ username })
    .then(([user]) => {
      if (user && bcryptjs.compareSync(password, user.password)) {
        res.status(200).json({welcome: user.username})
      } else {
        res.status(401).json({you: "cannot pass"})
      }
    })
    .catch(err => {
      res.status(500).send(err)
    })
})

module.exports = router;