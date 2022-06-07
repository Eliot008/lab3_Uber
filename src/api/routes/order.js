const express = require('express');
const mongo = require('../../../connection');
const router = express.Router();

router.get('/', async function (req, res, next) {
  const orders = await mongo.getOrders();
  res.send(orders);
});

router.get('/:id', async function (req, res, next) {
  const order = await mongo.getOrder(req.params.id);
  if (order) {
    res.send(order);
  } else {
    res.send({});
  }
});

router.post('/', async function (req, res, next) {
  const responseId = await mongo.createOrder(req.body);
  if (responseId) {
    res.send({ id: responseId, message: 'Order was successfully created' });
  } else {
    res.status(400);
    res.send({ message: 'Create error' });
  }
});

router.patch('/:id', async function (req, res, next) {
  const responseId = await mongo.updateOrder(req.params.id, req.body);
  if (responseId) {
    res.send({ id: responseId, message: 'Order was successfully updated' });
  } else {
    res.status(400);
    res.send({ message: 'Update error' });
  }
});

router.delete('/:id', async function (req, res, next) {
  const responseId = await mongo.deleteOrder(req.params.id);
  if (responseId) {
    res.send({ id: responseId, message: 'Order was successfully deleted' });
  } else {
    res.status(400);
    res.send({ message: 'Delete error' });
  }
});

module.exports = router;