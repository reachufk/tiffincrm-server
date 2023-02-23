const express = require('express');
const router = express.Router();
const orderService = require('../../services/orders/order-service');

router.post('/OrderPayment',orderService.OrderPayment);
router.post('/PlaceOrder',orderService.PlaceOrder);
router.post('/PlaceAdminOrder',orderService.PlaceAdminOrder);
router.post('/GetCompletedOrders',orderService.GetCompletedOrders);
router.get('/GetLatestOrders',orderService.GetLatestOrders);
router.post('/GetAdminOrders',orderService.GetAdminOrders);

module.exports = router;