const express = require('express');
const router = express.Router();
const { verifyUser, verifyAdmin, verifySuperAdmin } = require('../../middlewares/authMiddleware')
const userService = require('../../services/user/user-service');

router.post('/RegisterUser', userService.RegisterUser);
router.post('/verify-otp', userService.VerifyUsersOTP);

router.post('/Login', userService.Login);
router.put('/UpdateUser/:user', verifyUser, userService.UpdateUser);
router.get('/GetUser', verifyUser, userService.GetUser);
router.post('/GetUsers', userService.GetUsers);
router.get('/TodaysUser', userService.TodaysUser);
router.get('/TodaysOrder', userService.TodaysOrder);
router.get('/GetTodaysSales', userService.GetTodaysSales);


router.get('/GetUsersAnalyticsDaily', userService.GetUsersAnalyticsDaily);
router.get('/GetUsersAnalyticsMonthly', userService.GetUsersAnalyticsMonthly);
router.get('/GetOrdersAnalyticsDaily', userService.GetOrdersAnalyticsDaily);
router.get('/GetOrdersAnalyticsMonthly', userService.GetOrdersAnalyticsMonthly);

router.get('/GetCart/:user', verifyUser, userService.GetCart);
router.post('/AddCartItem/:user', verifyUser, userService.AddCartItem);
router.post('/RemoveCartItem/:user', verifyUser, userService.RemoveCartItem);
router.put('/UpdateCartItem/:user', verifyUser, userService.UpdateCartItem);
module.exports = router;