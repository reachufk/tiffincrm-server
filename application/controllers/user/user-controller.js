const express = require('express');
const router = express.Router();
const userService = require('../../services/user/user-service');

router.post('/RegisterUser',userService.RegisterUser)
router.post('/Login',userService.Login);
router.put('/UpdateUser',userService.Login);
router.get('/GetUser',userService.GetUser);
router.post('/GetUsers',userService.GetUsers);

router.get('/GetCart/:user',userService.GetCart);
router.post('/AddCartItem/:user',userService.AddCartItem);
router.post('/RemoveCartItem/:user',userService.RemoveCartItem);
router.put('/UpdateCartItem/:user',userService.UpdateCartItem);
module.exports = router;