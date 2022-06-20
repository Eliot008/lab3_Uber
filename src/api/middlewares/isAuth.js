const jwt = require('jsonwebtoken');
const mongo = require('../../../connection');

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.NODE_ENV_ACCESS_TOKEN_SECRET, async (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      
      const roleDocument = await mongo.getRole(user.roleId);
      if (roleDocument) {
        req.user = {
          ...user,
          role: roleDocument.role_name
        };
        next();
      } else {
        return res.sendStatus(500);
      }
    });
  } else {
    return res.sendStatus(401);
  }
};

module.exports = authenticateJWT;
