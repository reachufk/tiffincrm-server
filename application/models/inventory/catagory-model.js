const mongoose = require('mongoose');
const CategorySchema = new mongoose.Schema({
      catagoryName: { type: String, required: true, unique: true },
      catagoryImage: { type: String },
      catagoryImageType: { type: String }
},{timestamps:true});

const CategoryModel = mongoose.model('Catagories', CategorySchema, 'Catagories')
module.exports = CategoryModel;