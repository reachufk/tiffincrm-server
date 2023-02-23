const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
      _id:{ type: String, required: [true, "item not passed"] },
      itemName: { type: String, required: [true, "itemName not passed"] },
      itemPrice:{type:String,required:[true,"itemPrice not passed"]},
      count: { type: Number, required: [true, "number of items not passed"] },
}, { _id: false });

const AdminOrderSchema = new mongoose.Schema({
      username:{ type: String, required: true },
      email:{ type: String },
      phoneNumber:{ type: String, required: true },
      orderAddress: { type: String, required: true },
      orderAmount: { type: Number, required: true },
      orderMode: { type: String, required: [true, "must be either online or offline"] },
      orderItems: [ItemSchema],
      orderPaymentMode: { type: String, required: [true, "must be either online or offline"] },
      orderInstructions: { type: String },
      orderDeliveryTime: { type: String },
      orderType: { type: String },
},{ timestamps: true });

const OrderModel = mongoose.model('AdminOrders', AdminOrderSchema, 'AdminOrders')
module.exports = OrderModel;