const BannerModel = require('../../models/banner/banner-model')
const AwsUtility = require('../../utils/aws-utils');
exports.SaveBanner = async (req, res) => {
      const Banner = new BannerModel(req.body);
      const isExists = await BannerModel.find({ bannerName: Banner?.bannerName });
      if (isExists && isExists.length) {
            res.status(409).json('banner name alraedy exists');
      } else {
            try {
                  const banners = await BannerModel.countDocuments()
                  if (banners == 5) {
                        return res.status(401).json({ meessage: "ony 5 banners are allowedd" })
                  }
                  const imageData = {
                        fileName: Banner._id,
                        fileType: Banner.bannerImageType?.split('/')[1],
                        fileData: new Buffer.from(Banner?.bannerImage?.replace(/^data:image\/\w+;base64,/, ""), 'base64')
                  }
                  const awsImageLocation = await AwsUtility.UploadBannerImage(imageData);
                  if (awsImageLocation) {
                        Banner.bannerImage = awsImageLocation
                        await Banner.save();
                        res.status(201).json({ message: 'banner saved', statusCode: 200, data: Banner });
                  }
            } catch (error) {
                  res.status(400).json(error.message);
            }
      }
}

exports.GetBanners = async (req, res) => {
      try {
            const Banners = await BannerModel.find({});
            if (Banners && Banners.length) {
                  res.status(200).json({ statusCode: 200, data: Banners })
            } else {
                  res.status(204).json({ statusCode: 204, message: 'no banner found' })
            }
      } catch (error) {
            res.status(400).json(error.message)
      }

}

exports.UpdateBanner = async (req, res) => {
      const Banner = req.body;;
      const BannerID = req.params.banner;
      try {
            if (Banner?.bannerImage?.includes('base64')) {
                  const imageData = {
                        fileName: Banner._id,
                        fileType: Banner.bannerImageType,
                        fileData: new Buffer.from(Banner?.bannerImage?.replace(/^data:image\/\w+;base64,/, ""), 'base64')
                  }
                  const awsImageLocation = await AwsUtility.UploadBannerImage(imageData);
                  Banner.bannerImage = awsImageLocation
            }
            const bannerUpdated = await BannerModel.findOneAndUpdate({ _id: BannerID }, Banner);
            if (bannerUpdated) {
                  res.status(200).json({ message: 'banner updated', statusCode: 200, data: bannerUpdated });
            } else {
                  res.status(404).json('banner not found');
            }
      } catch (error) {
            res.status(400).json(error.message);
      }

}

exports.DeleteBanner = async (req, res) => {
      const BannerID = req.params.banner;
      try {
            const BannerDeleted = await BannerModel.findByIdAndDelete(BannerID);
            if (BannerDeleted) {
                  const fileName = BannerDeleted._id + '.' + BannerDeleted.bannerImageType.split('/')[1]
                  const isDeleted = await AwsUtility.DeleteBannerImage(fileName)
                  if (isDeleted) {
                        res.status(200).json({ message: 'banner deletd', statusCode: 200 });
                  } else {
                        res.status(209).json({ message: 'banner deletd', statusCode: 209, awsError: 'image not deleted' });
                  }
            } else {
                  res.status(404).json('banner not found');
            }
      } catch (error) {
            res.status(404).json(error.message);
      }

} 