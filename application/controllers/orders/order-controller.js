const express = require('express');
const router = express.Router();
const orderService = require('../../services/orders/order-service');

router.post('/OrderPayment',orderService.OrderPayment);
router.post('/PlaceOrder',orderService.PlaceOrder);
router.post('/GetCompletedOrders',orderService.GetCompletedOrders);
router.get('/GetLatestOrders',orderService.GetLatestOrders)

module.exports = router;