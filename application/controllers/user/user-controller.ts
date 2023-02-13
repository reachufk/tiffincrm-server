const express = require('express');
const router = express.Router();
const userService = require('../../services/user/user-service');

router.post('/RegisterUser',userService.RegisterUser)
router.post('/Login',userService.Login);
router.put('/UpdateUser',userService.Login);

module.exports = router;