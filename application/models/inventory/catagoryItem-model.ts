const mongoose = require('mongoose');
const CategoryItemSchema = new mongoose.Schema({
      catagory:{type:mongoose.Types.ObjectId,required:true},
      itemName:{type:String,required:true,unique:true},
      itemPrice:{type:Number,required:true},
      itemDiscount:{type:Number}
})

CategoryItemSchema.index({ itemName: "text"});

const CategoryItemModel = mongoose.model('CategoryItem', CategoryItemSchema, 'CategoryItem')
module.exports = CategoryItemModel;