const mongoose = require('mongoose');
const CategorySchema = new mongoose.Schema({
      catagoryName: { type: String, required: true, unique: true },
      catagoryType: { type: String, required: true },
      isInstant: { type: Boolean, required: true },
      catagoryImage: { type: String }
});

const CategoryModel = mongoose.model('Catagories', CategorySchema, 'Catagories')
module.exports = CategoryModel;