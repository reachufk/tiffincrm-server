import { Router } from "express";
const router = Router();
// const bannerService = require('../../services/banner/banner-service');
// import bannerService from '../../services/banner/banner-service'
import SaveBanner from '../../services/banner/banner-service'
import GetBanner from '../../services/banner/banner-service'
import GetBanners from '../../services/banner/banner-service'
import UpdateBanner from '../../services/banner/banner-service'
import DeleteBanner from '../../services/banner/banner-service'

router.post('/SaveBanner',SaveBanner);
router.get('/GetBanner',GetBanner);
router.get('/GetBanners',GetBanners);
router.put('/UpdateBanner',UpdateBanner);
router.delete('/DeleteBanner',DeleteBanner);

export default router