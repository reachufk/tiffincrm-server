import mongoose  from "mongoose";
import bcrypt from 'bcrypt'

const UserSchema = new mongoose.Schema({
     name: { type: String },
     phoneNumber: { type: Number, required: true, unique: true },
     password: { type: String, required: true }
})

UserSchema.pre('save', function (next) {
     const user = this;
     if (!user.isModified('password')) return next();
   
     bcrypt.genSalt(10, function (err, salt) {
       if (err) return next(err);
   
       bcrypt.hash(user.password, salt, function (err, hash) {
         if (err) return next(err);
         user.password = hash;
         next();
       });
     });
   });
   
   
   UserSchema.methods.comparePassword = async (inputPassword:any , 
    hashedPassword:any) => {
    // console.log(this.password)
    return await bcrypt.compare(inputPassword, hashedPassword);
  };
   

const UserModel = mongoose.model('Users', UserSchema, 'Users')
export default UserModel