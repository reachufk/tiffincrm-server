import mongoose from "mongoose";
const BannerSchema = new mongoose.Schema({
    bannerName: { type: String, required: true, unique: true },
    bannerImage: { type: String, require: true }
}, {
    collection: 'banner',
    capped: {
          max: 5,
          autoIndexId: true
    }
});
const BannerModel = mongoose.model('Banners', BannerSchema, 'Banners')
export default BannerModel;