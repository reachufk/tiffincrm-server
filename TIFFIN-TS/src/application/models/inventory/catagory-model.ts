import mongoose from "mongoose";
const CategorySchema = new mongoose.Schema({
      catagoryName: { type: String, required: true, unique: true },
      catagoryType: { type: String, required: true },
      isInstant: { type: Boolean, required: true },
      catagoryImage: { type: String },
      catagoryImageType: { type: String },
      catagoryImageName: { type: String }
});

const CategoryModel = mongoose.model('Catagories', CategorySchema, 'Catagories')

export default CategoryModel