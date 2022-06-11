const express = require('express');
const mongo = require('../../../connection');
const middlewares = require('../middlewares');
const router = express.Router();

router.get('/', middlewares.authenticateJWT, async function (req, res, next) {
  const orders = await mongo.getOrders();
  res.json(orders);
});

router.get('/:id', middlewares.authenticateJWT, async function (req, res, next) {
  const order = await mongo.getOrder(req.params.id);
  if (order) {
    res.json(order).status(200);
  } else {
    res.json({});
  }
});

router.post('/', middlewares.authenticateJWT, async function (req, res, next) {
  const responseId = await mongo.createOrder(req.body);
  if (responseId) {
    res.json({ id: responseId, message: 'Order was successfully created' }).status(200);
  } else {
    res.status(400);
    res.json({ message: 'Create error' });
  }
});

router.patch('/:id', middlewares.authenticateJWT, async function (req, res, next) {
  const responseId = await mongo.updateOrder(req.params.id, req.body);
  if (responseId) {
    res.json({ id: responseId, message: 'Order was successfully updated' }).status(200);
  } else {
    res.status(400);
    res.json({ message: 'Update error' });
  }
});

router.delete('/:id', middlewares.authenticateJWT, async function (req, res, next) {
  const responseId = await mongo.deleteOrder(req.params.id);
  if (responseId) {
    res.json({ id: responseId, message: 'Order was successfully deleted' }).status(200);
  } else {
    res.status(400);
    res.json({ message: 'Delete error' });
  }
});

module.exports = router;