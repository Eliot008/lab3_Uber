const express = require('express');
const mongo = require('../../../connection');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/login', async function (req, res, next) {
  const { email, password } = req.body;

  const users = await mongo.getUsers();
  const user = users.find((_) => _.email === email && _.password === password);

  if (user) {
    const accessToken = jwt.sign(
      { email: user.email, roleId: user.role_id },
      process.env.NODE_ENV_ACCESS_TOKEN_SECRET,
      { expiresIn: '1h' }
    );
    const refreshToken = jwt.sign(
      { email: user.email, roleId: user.role_id },
      process.env.NODE_ENV_ACCESS_TOKEN_SECRET
    );

    mongo.createToken({ refresh_token: refreshToken });

    res.json({
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } else {
    res.status(400).json({ message: 'Incorrect email or password' });
  }
});

router.post('/signup', async function (req, res, next) {
  const { first_name, last_name, email, password, role } = req.body;
  const roleUnit = await mongo.getRoleByName(role);
  if (!roleUnit._id) {
    res.sendStatus(500);
  }

  const responseId = await mongo.createUser({
    first_name: first_name,
    last_name: last_name,
    email: email,
    password: password,
    role_id: roleUnit._id,
  });

  if (!responseId) {
    res.status(400);
    res.json({ message: 'Create user error' });
  }

  const users = await mongo.getUsers();
  const user = users.find((_) => _.email === email && _.password === password);

  if (user) {
    const accessToken = jwt.sign(
      { email: user.email, roleId: user.role_id },
      process.env.NODE_ENV_ACCESS_TOKEN_SECRET,
      { expiresIn: '1h' }
    );
    const refreshToken = jwt.sign(
      { email: user.email, roleId: user.role_id },
      process.env.NODE_ENV_ACCESS_TOKEN_SECRET
    );

    mongo.createToken({ refresh_token: refreshToken });

    res.json({
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } else {
    res.status(400).json({ message: 'Incorrect email or password' });
  }
});

router.post('/token', async function (req, res) {
  const { token } = req.body;

  if (!token) {
    return res.sendStatus(401);
  }

  const refreshTokens = await mongo.getTokens();

  if (!refreshTokens.includes(token)) {
    return res.sendStatus(403);
  }

  jwt.verify(token, process.env.NODE_ENV_REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }

    const accessToken = jwt.sign({ username: user.username, role: user.role }, accessTokenSecret, { expiresIn: '1h' });

    res.json({
      accessToken,
    });
  });
});

router.post('/logout', async function (req, res, next) {
  const { token } = req.body;

  const refreshTokens = await mongo.getTokens();
  const { _id } = refreshTokens.find((_) => _ === token);
  const responseId = await mongo.deleteToken(_id);

  if (responseId) {
    res.json({ message: 'Logout successful' });
  } else {
    res.status(400);
    res.json({ message: 'Delete error' });
  }
});

module.exports = router;
