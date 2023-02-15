import express from 'express'
export const router = express.Router();

import UserController from '../controllers/user/user-controller'
// const AdminController = require('../controllers/admin/admin-controller');
// const BannerController = require('../controllers/banner/banner-controller');
import BannerController from '../controllers/banner/bannerController'
// const InventoryController = require('../controllers/inventory/inventory-controller')

router.use('/User/',UserController);
// router.use('/Admin/',AdminController);
// router.use('/Inventory/',InventoryController);
router.use('/Banner/',BannerController);

// module.exports = router;
export default router