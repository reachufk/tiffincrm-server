const BannerModel = require('../../models/banner/banner-model')

exports.SaveBanner = async (req, res) => {
      const Banner = new BannerModel(req.body);
      const BannerExists = BannerModel.find({ bannerName: Banner?.bannerName });
      if (BannerExists && BannerExists.length) {
            res.status(409).send('Banner already exists')
      }else{
            const isSaved = await Banner.save();
            if(isSaved){
                  res.status(201).send('Banner Saved sucessfully')
            }else{
                  res.status(400).send('internal server error');
            }
      }
}

exports.GetBanner = async (req,res)=>{
      const BannersId = req.params.id;
      const Banner = await BannerModel.findById(BannersId)
      if(Banner){
            res.status(201).send(Banner)
      }else{
            res.status(404).send('not found')
      }
}

exports.GetBanners = async (req,res)=>{
      const Banners = BannerModel.find({});
      if(Banners && Banners.length){
            res.status(201).send(Banners)
      }else{
            res.status(404).send('data empty')
      }
}

exports.UpdateBanner =  async (req,res)=>{
      const Banner = req.body;;
      const BannerID = req.params.id;
      isExists = await BannerModel.findOneAndUpdate({_id:BannerID},Banner)
      if(isExists){
            res.status(200).send("Banner Updated")
      }else{
            res.status(404).send("Banner not found")
      }
} 

exports.DeleteBanner =  async (req,res)=>{
      const BannerID = req.params.id;
      isDeleted = await BannerModel.findOneAndDelete({_id:BannerID})
      if(isDeleted){
            res.status(200).send("Banner deleted")
      }else{
            res.status(404).send("Banner not found")
      }
} 