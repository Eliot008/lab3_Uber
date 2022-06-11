const express = require('express');
const mongo = require('../../../connection');
const middlewares = require('../middlewares');
const router = express.Router();

router.get('/', middlewares.authenticateJWT, async function (req, res, next) {
  const roles = await mongo.getRoles();
  res.send(roles)
})

router.get('/:id', middlewares.authenticateJWT, async function (req, res, next) {
  const role = await mongo.getRole(req.params.id);
  if (role) {
    res.send(role);
  } else {
    res.send({});
  }
});

module.exports = router;