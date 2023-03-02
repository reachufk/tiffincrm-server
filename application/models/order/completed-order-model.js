const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
      itemId:{ type: String, required: [true, "item not passed"] },
      catagory:{type:String},
      itemName: { type: String, required: [true, "itemName not passed"] },
      itemPrice:{type:String,required:[true,"itemPrice not passed"]},
      itemTypes:[],
      selectedItemType:{type:Object},
      count: { type: Number, required: [true, "number of items not passed"] },
}, { _id: false });

const CompletedOrderSchema = new mongoose.Schema({
      prevOrderId:{ type: String, required: true ,unique:true},
      user: { type: String },
      orderAddress: { type: String, required: true },
      orderAmount: { type: Number, required: true },
      orderMode: { type: String, required: [true, "must be either online or offline"] },
      orderItems: [ItemSchema],
      orderPaymentMode: { type: String, required: [true, "must be either online or offline"] },
      orderInstructions: { type: String },
      orderDeliveryTime: { type: String },
      orderType: { type: String },
      orderPaymentStatus: { type: String },
      userInfo: {},
      orderStatus: { type: String, required: [true, "must be either completed"] },
},{ timestamps: true });

CompletedOrderSchema.index({ prevOrderId: 1 });

const CompletedOrderModel = mongoose.model('CompletedOrders', CompletedOrderSchema, 'CompletedOrderModel')
module.exports = CompletedOrderModel;