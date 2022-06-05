var express = require('express');
var router = express.Router();
var mongo = require('../../../connection');

/* GET users listing. */
router.get('/', async function (req, res, next) {
  if (req.query.id) {
    const user = await mongo.getUser(req.query.name);
    res.send(user);
  } else {
    res.status(400);
    res.send('Invalid Params');
  }
  
});

/* GET users listing. */
router.get('/illya', async function (req, res, next) {
  const user = await mongo.getUser('Illya');
  res.send(user);
});


module.exports = router;
