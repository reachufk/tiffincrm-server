const jwt = require('jsonwebtoken')
const secretKey = 'secretkey';

 const Authorize = (payload) => {
      return jwt.sign(payload, secretKey, { expiresIn: '2h' });
};

 const isAuthorized = (token) => {
      try {
            return jwt.verify(token, secretKey);
      } catch (err) {
            return false;
      }
};

module.exports = {Authorize,isAuthorized}
