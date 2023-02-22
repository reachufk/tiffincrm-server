import { model, Schema, Types } from "mongoose";

export const ItemModel = model(
  "Item",
  new Schema({
    name: { type: String, unique: true, required: [true, 'Item name is required.'] },
    image: { type: String, required: [true, 'please select the Item image.'] },
    imageType: { type: String },
    catagory: { type: Types.ObjectId, required: [true, 'please select the catagory.'] },
    price: { type: Number, required: [true, 'please add the price.'] },
    discount: { type: Number, default: 0 }
  })
);