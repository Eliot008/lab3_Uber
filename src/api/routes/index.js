const express = require('express');
const router = express.Router();
const middlewares = require('../middlewares');

/* GET home page. */
router.get('/', middlewares.authenticateJWT, function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
