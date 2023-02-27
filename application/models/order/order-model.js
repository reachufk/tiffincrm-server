const mongoose = require('mongoose');
const UserModel = require('../user/user-model');

const ItemSchema = new mongoose.Schema({
      itemId:{ type: String, required: [true, "item not passed"] },
      catagory:{type:String},
      itemName: { type: String, required: [true, "itemName not passed"] },
      itemPrice:{type:String,required:[true,"itemPrice not passed"]},
      itemTypes:[],
      selectedItemType:{type:Object},
      count: { type: Number, required: [true, "number of items not passed"] },
}, { _id: false });

const OrderSchema = new mongoose.Schema({
      user: { type: mongoose.Types.ObjectId },
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
      orderStatus: { type: String, required: [true, "must be either completed or pending"] },
},{ timestamps: true });


OrderSchema.pre('save', async function (next) {
      const order = this;
      const { user } = order;
      try {
            const userInfo = await UserModel.findOne({_id:user},{password:0,_id:0,__v:0});
            if(userInfo){
                  order.userInfo = userInfo;
                  next();
            }
      } catch (error) {
            return error
      }
});


const OrderModel = mongoose.model('Orders', OrderSchema, 'Orders')
module.exports = OrderModel;