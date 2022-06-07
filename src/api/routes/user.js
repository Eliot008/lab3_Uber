var express = require('express');
var router = express.Router();
var mongo = require('../../../connection');

router.get('/', async function (req, res, next) {
  const users = await mongo.getUsers();
  res.send(users);
});

router.get('/:id', async function (req, res, next) {
  const user = await mongo.getUser(req.params.id);
  if (user) {
    res.send(user);
  } else {
    res.send({});
  }
});

router.post('/', async function (req, res, next) {
  const responseId = await mongo.createUser(req.body);
  if (responseId) {
    res.send({ id: responseId, message: 'User was successfully created' });
  } else {
    res.status(400);
    res.send({ message: 'Create error' });
  }
});

router.patch('/:id', async function (req, res, next) {
  const responseId = await mongo.updateUser(req.params.id, req.body);
  if (responseId) {
    res.send({ id: responseId, message: 'User was successfully updated' });
  } else {
    res.status(400);
    res.send({ message: 'Update error' });
  }
});

router.delete('/:id', async function (req, res, next) {
  const responseId = await mongo.deleteUser(req.params.id);
  if (responseId) {
    res.send({ id: responseId, message: 'User was successfully deleted' });
  } else {
    res.status(400);
    res.send({ message: 'Delete error' });
  }
});

module.exports = router;
