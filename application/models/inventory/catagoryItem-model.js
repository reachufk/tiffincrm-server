const mongoose = require('mongoose');
const CategoryItemSchema = new mongoose.Schema({
      catagory:{type:String,required:true},
      itemName:{type:String,required:[true,'item must have a name'],unique:[true,'item must have unique name']},
      itemPrice:{type:Number,required:[true,'item price not passed']},
      isVeg:{type:Boolean,required:[true,'item should be either veg or non-veg']},
      itemDescription:{type:String},
      itemDiscount:{type:Number}
},{timestamps:true})

CategoryItemSchema.index({ itemName: "text"});

const CategoryItemModel = mongoose.model('CategoryItem', CategoryItemSchema, 'CategoryItem')
module.exports = CategoryItemModel;