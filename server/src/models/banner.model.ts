import { model, Schema } from "mongoose";

export const BannerModel = model(
  "Banner",
  new Schema({
    name: { type: String, unique: true, required: [true, 'Banner name is required.'] },
    image: { type: String, required: [true, 'please select the Banner image.'] },
    imageType: { type: String }
  }, {
    capped: {
      max: 5,
      autoIndexId: true
    }
  })
);