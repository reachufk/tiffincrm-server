const mongoose = require('mongoose');

const ItemTypesSchema = new mongoose.Schema({
      typeName:{ type: String},
      typeValue:{type:Number}
}, { _id: false });

const CategoryItemSchema = new mongoose.Schema({
      catagory:{type:String,required:true},
      itemName:{type:String,required:[true,'item must have a name'],unique:[true,'item must have unique name']},
      itemPrice:{type:Number,required:[true,'item price not passed']},
      isVeg:{type:Boolean,required:[true,'item should be either veg or non-veg']},
      itemTypes:[ItemTypesSchema],
      selectedItemType:{type:Object},
      itemDescription:{type:String},
      itemDiscount:{type:Number}
},{timestamps:true})

const CategoryItemModel = mongoose.model('CategoryItem', CategoryItemSchema, 'CategoryItem')
module.exports = CategoryItemModel;