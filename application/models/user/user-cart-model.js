const mongoose = require('mongoose');

const ItemTypesSchema = new mongoose.Schema({
      typeName:{ type: String},
      typeValue:{type:Number}
}, { _id: false });

const ItemSchema = new mongoose.Schema({
      _id:{type:mongoose.Types.ObjectId},
      itemId:{ type: String, required: [true, "item not passed"] },
      catagory:{type:String},
      isVeg:{type:Boolean},
      itemName: { type: String, required: [true, "itemName not passed"] },
      itemTypes:[ItemTypesSchema],
      selectedItemType:{type:Object},
      itemInstructions:{type:String},
      itemPrice:{type:String,required:[true,"itemPrice not passed"]},
      count: { type: Number, required: [true, "number of items not passed"] },
});

const UserCartSchema = new mongoose.Schema({
     user: { type: String,required:true ,unique:[true,'user cart already exists']},
     cartItems:[ItemSchema]
},{timestamps:true})



const UserCartModel = mongoose.model('UserCart', UserCartSchema, 'UserCart')
module.exports = UserCartModel;