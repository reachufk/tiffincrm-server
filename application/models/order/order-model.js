const mongoose = require('mongoose');
const orderItemSchema = new mongoose.Schema({
      itemName: { type: String, required:[true,"itemName not passed"] },
      count: { type: Number, required:[true,"number of items not passed"] },
    }, { _id: false });
    
const OrderSchema = new mongoose.Schema({
      user: { type: mongoose.Types.ObjectId },
      orderAddress: { type: String, required: true },
      orderAmount: { type: Number, required: true },
      orderMode: { type: String, required:[true,"must be either online or offline"] },
      orderCatagory: { type: Array, required: true },
      orderItems:[orderItemSchema],
      orderPaymentMode: { type: String, required:[true,"must be either online or offline"] },
      orderInstructions: { type: String },
      orderDeliveryTime: { type: String },
      orderPayment: { type: String },
      orderStatus:{type:String ,required:[true,"must be either completed or pending"]},
});

const OrderModel = mongoose.model('Orders', OrderSchema, 'Orders')
module.exports = OrderModel;