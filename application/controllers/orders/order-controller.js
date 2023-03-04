const express = require('express');
const router = express.Router();
const orderService = require('../../services/orders/order-service');
const {verifyAdmin,verifyUser} = require('../../middlewares/authMiddleware')
router.post('/CreateRpayOrder',verifyUser,orderService.CreateRpayOrder);
router.post('/VerifyPayment',verifyUser, orderService.VerifyPayment)
router.post('/PlaceOrder',verifyUser,orderService.PlaceOrder);
router.post('/PlaceAdminOrder',verifyAdmin,orderService.PlaceAdminOrder);
router.post('/SetCompletedOrder/:orderId',verifyAdmin,orderService.SetCompletedOrder);
router.post('/GetCompletedOrders',verifyAdmin,orderService.GetCompletedOrders);
router.get('/GetLatestOrders',verifyAdmin,orderService.GetLatestOrders);
router.post('/GetAdminOrders',verifyAdmin,orderService.GetAdminOrders);
router.get('/GetFutureOrders',verifyAdmin,orderService.GetFutureOrders);
router.get('/GetUserOrders/:user',verifyUser,orderService.GetUserOrders);

module.exports = router;