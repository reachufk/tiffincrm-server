const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user/user-controller');
const AdminController = require('../controllers/admin/admin-controller');
const BannerController = require('../controllers/banner/banner-controller');
const InventoryController = require('../controllers/inventory/inventory-controller');
const OrderController = require('../controllers/orders/order-controller')

router.use('/User/',UserController);
router.use('/Admin/',AdminController);
router.use('/Inventory/',InventoryController);
router.use('/Banners/',BannerController);
router.use('/Orders/',OrderController);

module.exports = router;