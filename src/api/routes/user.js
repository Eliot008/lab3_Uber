const express = require('express');
const mongo = require('../../../connection');
const middlewares = require('../middlewares');
const router = express.Router();

router.get('/', middlewares.authenticateJWT, async function (req, res, next) {
  const { role } = req.user;

  if (role !== 'admin') {
    return res.sendStatus(403);
  }

  const users = await mongo.getUsers();
  res.json(users);
});

router.get('/:id', middlewares.authenticateJWT, async function (req, res, next) {
  const user = await mongo.getUser(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.json({});
  }
});

router.post('/', middlewares.authenticateJWT, async function (req, res, next) {
  const responseId = await mongo.createUser(req.body);
  if (responseId) {
    res.json({ id: responseId, message: 'User was successfully created' });
  } else {
    res.status(400);
    res.json({ message: 'Create error' });
  }
});

router.patch('/:id', middlewares.authenticateJWT, async function (req, res, next) {
  const responseId = await mongo.updateUser(req.params.id, req.body);
  if (responseId) {
    res.json({ id: responseId, message: 'User was successfully updated' });
  } else {
    res.status(400);
    res.json({ message: 'Update error' });
  }
});

router.delete('/:id', middlewares.authenticateJWT, async function (req, res, next) {
  const { role } = req.user;

  if (role !== 'admin') {
    return res.sendStatus(403);
  }

  const responseId = await mongo.deleteUser(req.params.id);
  if (responseId) {
    res.json({ id: responseId, message: 'User was successfully deleted' });
  } else {
    res.status(400);
    res.json({ message: 'Delete error' });
  }
});

module.exports = router;
