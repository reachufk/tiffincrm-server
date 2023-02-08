const mongoose = require('mongoose');
const CategoryItemSchema = new mongoose.Schema({
      catagory:{type:mongoose.Types.ObjectId},
      itemName:{type:String,required:true,unique:true},
      itemPrice:{type:Number,required:true},
      itemDiscount:{type:Number}
})

const CategoryItemModel = mongoose.model('CategoryItem', CategoryItemSchema, 'CategoryItem')
module.exports = CategoryItemModel;