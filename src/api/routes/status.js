const express = require('express');
const mongo = require('../../../connection');
const middlewares = require('../middlewares');
const router = express.Router();

router.get('/', middlewares.authenticateJWT, async function (req, res, next) {
  const statuses = await mongo.getStatuses();
  res.send(statuses);
});

router.get('/:id', middlewares.authenticateJWT, async function (req, res, next) {
  const status = await mongo.getStatus(req.params.id);
  if (status) {
    res.send(status);
  } else {
    res.send({});
  }
});

module.exports = router;
