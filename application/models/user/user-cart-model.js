const mongoose = require('mongoose');
const CategoryItemModel = require('../inventory/catagoryItem-model');

const ItemSchema = new mongoose.Schema({
      itemId:{ type: String, required: [true, "item not passed"],unique:true },
      catagory:{type:String},
      isVeg:{type:Boolean},
      itemName: { type: String, required: [true, "itemName not passed"] },
      itemPrice:{type:String,required:[true,"itemPrice not passed"]},
      count: { type: Number, required: [true, "number of items not passed"] },
}, { _id: false });

const UserCartSchema = new mongoose.Schema({
     user: { type: String,required:true },
     cartItems:[ItemSchema]
},{timestamps:true})

const UserCartModel = mongoose.model('UserCart', UserCartSchema, 'UserCart')
module.exports = UserCartModel;