// const jwt = require('jsonwebtoken')
import jwt from 'jsonwebtoken'
const secretKey = 'secretkey';

 const Authorize = (payload:any) => {
      return jwt.sign({payload}, secretKey, { expiresIn: '2h' });
};

 const isAuthorized = (token:any) => {
      try {
            return jwt.verify(token, secretKey);
      } catch (err) {
            return false;
      }
};

// module.exports = {Authorize,isAuthorized}
export default {Authorize, isAuthorized}
