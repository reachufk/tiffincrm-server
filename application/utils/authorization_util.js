const jwt = require('jsonwebtoken')
const config = require('../../config/config')

const authorizeUser =  (payload) => {
      return jwt.sign(payload, config.SecretKey, { expiresIn: "8h" });
};
const authorizeAdmin =  (payload) => {
      return jwt.sign(payload, config.SecretKeyAdmin, { expiresIn: '8h' });
}
const authorizeSuperAdmin = (payload) => {
      return jwt.sign(payload, config.SecretKeyAdmin, { expiresIn: '8h' });
}
const isUserAuthorized =  (token) => {
      try {
            return jwt.verify(token, config.SecretKey);
      } catch (err) {
            return false;
      }
};
const isAdminAuthorized =  (token) => {
      try {
            return  jwt.verify(token, config.SecretKeyAdmin);
      } catch (err) {
            return false;
      }
};
const isSuperAdminAuthorized = (token) => {
      try {
            return jwt.verify(token, config.SecretKeySuperAdmin);
      } catch (err) {
            return false;
      }
};

module.exports = {
      authorizeUser,
      isUserAuthorized,
      isAdminAuthorized,
      authorizeAdmin,
      authorizeSuperAdmin,
      isSuperAdminAuthorized
}
