const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user/user-controller');
const AdminController = require('../controllers/admin/admin-controller');
const BannerController = require('../controllers/banner/banner-controller');
const InventoryController = require('../controllers/inventory/inventory-controller')

router.use('/User/',UserController);
router.use('/Admin/',AdminController);
router.use('/Inventory/',InventoryController);
router.use('/Banner/',BannerController);

module.exports = router;