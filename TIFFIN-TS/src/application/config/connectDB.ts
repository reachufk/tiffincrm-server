
import mongoose from "mongoose";

// mongoose.connect(environment.databaseConnection,
//     { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log("connection to database sucessfully."))
//     .catch((error) => console.log(error));

let mongoUrl = "mongodb+srv://Asif:Asif.chap111@tiffinaawdb.owxh4.mongodb.net/TiffinAawDB"
const connectDb = async () => {
    
    mongoose.set("strictQuery", false);
    const conn = await mongoose.connect(mongoUrl)
    console.log(`Database connected ${conn.connection.host}`)
}

export default connectDb