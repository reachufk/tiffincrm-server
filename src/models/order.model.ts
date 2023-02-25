import { Schema, model, Types } from "mongoose";
import { CatagoryModel } from "./category.model";

const ItemSchema = new Schema({
  itemId: { type: String, required: [true, "Item id not provided"] },
  name: { type: String, required: [true, "Item name not provided"] },
  price: { type: String, required: [true, "Item price not provided"] },
  count: { type: Number, required: [true, "number of items not provided"] },
}, { _id: false });

const orderedItemSchema = new Schema({
  id: { type: String, required: [true, "Catagory id not provided"] },
  name: { type: String, required: [true, "Catagory name not provided"] },
  items: [ItemSchema]
}, { _id: false });

const OrderSchema = new Schema({
  user: { type: Types.ObjectId },
  address: { type: String, required: true },
  amount: { type: Number, required: true },
  mode: { type: String, required: [true, "must be either online or offline"] },
  items: [orderedItemSchema],
  paymentMode: { type: String, required: [true, "must be either online or offline"] },
  instructions: { type: String },
  deliveryTime: { type: String },
  type: { type: String },
  paymentStatus: { type: String },
  userInfo: {},
  status: { type: String, required: [true, "must be either completed or pending"] },
});


OrderSchema.pre('save', async function (next) {
  const order: any = this;
  const catagoriesID = order.orderCatagory;
  const projection = { catagoryImage: 0, catagoryImageType: 0, __v: 0 }
  const catagories = await CatagoryModel.find({ '_id': { $in: catagoriesID } }, projection);
  order.orderCatagory = catagories;
  next();
});

export const OrderModel = model("Order", OrderSchema);