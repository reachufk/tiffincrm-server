const mongoose = require('mongoose');
const BannerSchema = new mongoose.Schema({
      bannerName: { type: String, required: true, unique: true },
      bannerImage: { type: String, require: true }
}, {
      collection: 'Banners',
      capped: {
            max: 5,
            autoIndexId: true
      }
});
const BannerModel = mongoose.model('Banners', BannerSchema, 'Banners')
module.exports = BannerModel;