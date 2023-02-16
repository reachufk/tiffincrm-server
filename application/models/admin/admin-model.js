const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const AdminSchema = new mongoose.Schema({
     email: { type: String,required:true,unique:true },
     firstName:{type:String,required:true},
     lastName:{type:String},
     phoneNumber: { type: Number, required: true, unique: true },
     password: { type: String, required: true }
})

AdminSchema.pre('save', function (next) {
     const admin = this;
     if (!admin.isModified('password')) return next();
   
     bcrypt.genSalt(10, function (err, salt) {
       if (err) return next(err);
   
       bcrypt.hash(admin.password, salt, function (err, hash) {
         if (err) return next(err);
         admin.password = hash;
         next();
       });
     });
   });
   
   
   AdminSchema.methods.comparePassword = async (inputPassword,hashedPassword) => {
    return await bcrypt.compare(inputPassword, hashedPassword);
  };
   

const AdminModel = mongoose.model('Admins', AdminSchema, 'Admins')
module.exports = AdminModel;