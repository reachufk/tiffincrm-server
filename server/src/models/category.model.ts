import { model, Schema } from "mongoose";

export const CatagoryModel = model(
  "Catagory",
  new Schema({
    name: { type: String, unique: true, required: [true, 'Catagory name is required.'] },
    image: { type: String, required: [true, 'please select the Catagory image.'] },
    imageType: { type: String, required: [true, 'image type is required.'] }
  })
);