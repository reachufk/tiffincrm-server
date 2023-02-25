const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const UserSchema = new mongoose.Schema({
     username: { type: String,required:true },
     email:{type:String,required:true,unique:true},
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
   
   
   UserSchema.methods.comparePassword = async (inputPassword,hashedPassword) => {
    return await bcrypt.compare(inputPassword, hashedPassword);
  };
   

const UserModel = mongoose.model('Users', UserSchema, 'Users')
module.exports = UserModel;