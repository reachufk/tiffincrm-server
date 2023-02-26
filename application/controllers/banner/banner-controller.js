const express = require('express');
const router = express.Router();
const bannerService = require('../../services/banner/banner-service');

router.post('/SaveBanner',bannerService.SaveBanner);
router.get('/GetBanners',bannerService.GetBanners);
router.put('/UpdateBanner/:banner',bannerService.UpdateBanner);
router.delete('/DeleteBanner/:banner',bannerService.DeleteBanner);

module.exports = router;