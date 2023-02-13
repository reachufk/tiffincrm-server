// const express = require('express');
const router = express.Router();
const bannerService = require('../../services/banner/banner-service');

router.post('/SaveBanner',bannerService.SaveBanner);
router.get('/GetBanner',bannerService.GetBanner);
router.get('/GetBanners',bannerService.GetBanners);
router.put('/UpdateBanner',bannerService.UpdateBanner);
router.delete('/DeleteBanner',bannerService.DeleteBanner);

module.exports = router;