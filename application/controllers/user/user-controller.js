const express = require('express');
const router = express.Router();
const { verifyUser, verifyAdmin, verifySuperAdmin } = require('../../middlewares/authMiddleware')
const userService = require('../../services/user/user-service');

router.post('/RegisterUser', userService.RegisterUser);
router.post('/verify-otp', userService.VerifyUsersOTP);

router.post('/Login', userService.Login);
router.put('/UpdateUser/:user', verifyUser, userService.UpdateUser);
router.get('/GetUser', verifyUser, userService.GetUser);
router.post('/GetUsers', verifySuperAdmin, userService.GetUsers);

router.get('/GetCart/:user', verifyUser, userService.GetCart);
router.post('/AddCartItem/:user', verifyUser, userService.AddCartItem);
router.post('/RemoveCartItem/:user', verifyUser, userService.RemoveCartItem);
router.put('/UpdateCartItem/:user', verifyUser, userService.UpdateCartItem);
module.exports = router;