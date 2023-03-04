const express = require('express');
const router = express.Router();
const bannerService = require('../../services/banner/banner-service');
const {verifyAdmin} = require('../../middlewares/authMiddleware');

router.post('/SaveBanner',verifyAdmin,bannerService.SaveBanner);
router.get('/GetBanners',bannerService.GetBanners);
router.put('/UpdateBanner/:banner',verifyAdmin,bannerService.UpdateBanner);
router.delete('/DeleteBanner/:banner',verifyAdmin,bannerService.DeleteBanner);

module.exports = router;