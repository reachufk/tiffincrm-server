const express = require('express');
const router = express.Router();
const userService = require('../../services/user/user-service');

router.post('/RegisterUser',userService.RegisterUser)
router.post('/Login',userService.Login);
router.put('/UpdateUser',userService.Login);
router.get('/GetUser',userService.GetUser);
router.post('/GetUsers',userService.GetUsers);
router.get('/GetOrders',userService.GetOrders);


module.exports = router;