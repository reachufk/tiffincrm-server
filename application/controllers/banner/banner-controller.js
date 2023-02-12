const express = require('express');
const router = express.Router();
const bannerService = require('../../services/banner/banner-service');

router.post('/SaveBanner',bannerService.SaveBanner);
router.get('/GetBanner/:id',bannerService.GetBanner);
router.get('/GetBanners',bannerService.GetBanners);
router.put('/UpdateBanner/:id',bannerService.UpdateBanner);
router.delete('/DeleteBanner/:id',bannerService.DeleteBanner);

module.exports = router;