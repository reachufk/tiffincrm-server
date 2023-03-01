const mongoose = require('mongoose');

const ItemTypesSchema = new mongoose.Schema({
      typeName:{ type: String},
      typeValue:{type:Number}
}, { _id: false });

const ItemSchema = new mongoose.Schema({
      itemId:{ type: String, required: [true, "item not passed"],unique:true },
      catagory:{type:String},
      isVeg:{type:Boolean},
      itemName: { type: String, required: [true, "itemName not passed"] },
      itemTypes:[ItemTypesSchema],
      selectedItemType:{type:Object},
      itemInstructions:{type:String},
      itemPrice:{type:String,required:[true,"itemPrice not passed"]},
      count: { type: Number, required: [true, "number of items not passed"] },
}, { _id: false });

const UserCartSchema = new mongoose.Schema({
     user: { type: String,required:true },
     cartItems:[ItemSchema]
},{timestamps:true})

const UserCartModel = mongoose.model('UserCart', UserCartSchema, 'UserCart')
module.exports = UserCartModel;