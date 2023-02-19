const mongoose = require('mongoose');
const CatagoryModel = require('../inventory/catagory-model');

const ItemSchema = new mongoose.Schema({
      itemId:{ type: String, required: [true, "itemName not passed"] },
      itemName: { type: String, required: [true, "itemName not passed"] },
      itemPrice:{type:String,required:[true,"itemPrice not passed"]},
      count: { type: Number, required: [true, "number of items not passed"] },
}, { _id: false });


const orderedItemSchema = new mongoose.Schema({
      catagoryName:{ type: String, required: [true, "catagory name not passed"] },
      catagoryID:{ type: String, required: [true, "catagoryId not passed"] },
      items:[ItemSchema]
}, { _id: false });

const OrderSchema = new mongoose.Schema({
      user: { type: mongoose.Types.ObjectId },
      orderAddress: { type: String, required: true },
      orderAmount: { type: Number, required: true },
      orderMode: { type: String, required: [true, "must be either online or offline"] },
      orderItems: [orderedItemSchema],
      orderPaymentMode: { type: String, required: [true, "must be either online or offline"] },
      orderInstructions: { type: String },
      orderDeliveryTime: { type: String },
      orderType: { type: String },
      orderPaymentStatus: { type: String },
      userInfo: {},
      orderStatus: { type: String, required: [true, "must be either completed or pending"] },
});


OrderSchema.pre('save', async function (next) {
      const order = this;
      const catagoriesID = order.orderCatagory;
      const projection = {catagoryImage: 0, catagoryImageType: 0,__v:0}
      const catagories = await CatagoryModel.find({ '_id': { $in: catagoriesID } },projection);
      order.orderCatagory = catagories;
      next();
});


const OrderModel = mongoose.model('Orders', OrderSchema, 'Orders')
module.exports = OrderModel;