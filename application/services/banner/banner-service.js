const BannerModel = require('../../models/banner/banner-model')

exports.SaveBanner = async (req, res) => {
      const Banner = new BannerModel(req.body);
      const BannerExists = BannerModel.find({ bannerName: Banner?.bannerName });
      if (BannerExists && BannerExists.length) {
            res.status(409).send('Banner already exists')
      }
}