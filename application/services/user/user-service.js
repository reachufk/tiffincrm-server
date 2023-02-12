const Authorization = require('../../utils/authorization_util');
const UserModel = require('../../models/user/user-model')

exports.RegisterUser = async (req, res) => {
      const User = new UserModel(req.body)
      const UserExists = await UserModel.find({ phoneNumber: User.phoneNumber });
      if (UserExists.length) {
            res.status(409).send('phone number is already registered');
      } else {
            const UserSaved = await User.save();
            if (UserSaved) {
                  res.status(201).send('user created');
            }
      }
}

exports.Login = async (req, res) => {
      const payload = req.body;
      const User = await UserModel.findOne({ phoneNumber:payload.phoneNumber });
      if (User) {
           const isMatched = await User.comparePassword(payload.password,User.password);
           if(isMatched){
            const token = Authorization.Authorize(User?._doc);
            const response ={name:User.name,phoneNumber:User.phoneNumber,token}
            res.status(200).send(response)
           }else{
            res.status(401).send('invalid phone/password');
           }
      }else{
            res.status(404).send('invalid phone');
      }
}

exports.UpdateUser = async (req, res) => {
      const {phoneNumber,name} = req.body;
      const UpdateUser = await UserModel.findOneAndUpdate({_id:User?._id},{phoneNumber,name});
      if (UpdateUser) {
            res.status(200).send('user updated');
      }else{
            res.status(404).send('user not found');
      }
}
