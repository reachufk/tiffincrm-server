import mongoose, { connect } from "mongoose";

export const connectDB = async () => {
  try {
    mongoose.set("strictQuery", false);
    await connect(`mongodb+srv://Asif:Asif.chap111@tiffinaawdb.owxh4.mongodb.net/TiffinAawDB`)
    console.log("MongoDB connection success.");
  } catch (error) {
    console.error(`MongoDB connection fail`);
    console.error(error);
    process.exit();
  }
}