const BannerModel = require('../../models/banner/banner-model')

exports.SaveBanner = async (req, res) => {
      const Banner = new BannerModel(req.body);
      try {
            const BannerExists = BannerModel.find({ bannerName: Banner?.bannerName });
            if (BannerExists && BannerExists.length) {
                  res.status(409).send('Banner already exists')
            } else {
                  try {
                        await Banner.save();
                        res.status(201).send('Banner Saved sucessfully')
                  } catch (error) {
                        res.status(500).send(error.message)
                  }
            }
      } catch (error) {
            res.status(400).send(error.message)
      }
}

exports.GetBanner = async (req, res) => {
      const BannersId = req.query.banner;
      try {
            const Banner = await BannerModel.findById(BannersId)
            if (Banner) {
                  res.status(201).send(Banner)
            } else {
                  res.status(404).send('not found')
            }
      } catch (error) {
            res.status(400).send(error.message)
      }

}

exports.GetBanners = async (req, res) => {
      try {
            const Banners = BannerModel.find({});
            if (Banners && Banners.length) {
                  res.status(201).send(Banners)
            } else {
                  res.status(404).send('data empty')
            }
      } catch (error) {
            res.status(400).send(error.message)
      }

}

exports.UpdateBanner = async (req, res) => {
      const Banner = req.body;;
      const BannerID = req.query.banner;
      try {
           const isExists = await BannerModel.findOneAndUpdate({ _id: BannerID }, Banner)
            if (isExists) {
                  res.status(200).send("Banner Updated")
            } else {
                  res.status(404).send("Banner not found")
            }
      } catch (error) {
            res.status(400).send(error.message)
      }

}

exports.DeleteBanner = async (req, res) => {
      const BannerID = req.query.banner;
      try {
            const isDeleted = await BannerModel.findOneAndDelete({ _id: BannerID })
            if (isDeleted) {
                  res.status(200).send("Banner deleted")
            } else {
                  res.status(404).send("Banner not found")
            }
      } catch (error) {
            res.status(400).send(error.message)
      }

} 