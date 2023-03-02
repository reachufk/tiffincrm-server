const express = require('express');
const router = express.Router();
const orderService = require('../../services/orders/order-service');

router.post('/CreateRpayOrder',orderService.CreateRpayOrder);
router.post('/VerifyPayment', orderService.VerifyPayment)
router.post('/PlaceOrder',orderService.PlaceOrder);
router.post('/PlaceAdminOrder',orderService.PlaceAdminOrder);
router.get('/SetCompletedOrder/:orderId',orderService.SetCompletedOrder);
router.post('/GetCompletedOrders',orderService.GetCompletedOrders);
router.get('/GetLatestOrders',orderService.GetLatestOrders);
router.post('/GetAdminOrders',orderService.GetAdminOrders);
router.get('/GetUserOrders/:user',orderService.GetUserOrders);

module.exports = router;