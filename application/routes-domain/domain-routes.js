const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user/user-controller');
const Admintroller = require('../controllers/admin/admin-controller');

router.use('/User/',UserController);
router.use('/Admin/',Admintroller);

module.exports = router;