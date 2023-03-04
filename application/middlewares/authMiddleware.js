const { isUserAuthorized,isAdminAuthorized ,isSuperAdminAuthorized} = require('../utils/authorization_util');

const verifyUser = async(req, res, next) => {
      
      const authHeader = req.headers.authorization;
      if (authHeader) {
            const token = authHeader.split(' ')[1];
            const authorizedUser =  isUserAuthorized(token);
            if(!authorizedUser){
                 return res.status(403).json({ error: 'Forbidden' });
            }
            next();
      } else {
            res.status(401).json({ error: 'Unauthorized' });
      }
};

const verifyAdmin = async(req, res, next) => {
      const authHeader = req.headers.authorization;
      if (authHeader) {
            const token = authHeader.split(' ')[1];
            const authorizedAdmin =  isAdminAuthorized(token);
            if(!authorizedAdmin){
                 return res.status(403).json({ error: 'Forbidden' });
            }
            next();
      } else {
            res.status(401).json({ error: 'Unauthorized' });
      }
};

const verifySuperAdmin = async(req, res, next) => {
      const authHeader = req.headers.authorization;
      if (authHeader) {
            const token = authHeader.split(' ')[1];
            const authorizedSuperAdmin =  isAdminAuthorized(token);
            if(!authorizedSuperAdmin){
                 return res.status(403).json({ error: 'Forbidden' });
            }
            next();
      } else {
            res.status(401).json({ error: 'Unauthorized' });
      }
};

module.exports = {verifyUser,verifyAdmin,verifySuperAdmin};