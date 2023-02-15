// const Authorization = require('../../utils/authorization_util');
import Authorization from '../../utils/authorization_util'
// const UserModel = require('../../models/user/user-model')
import UserModel from "../../models/user/userModel";
import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
export default

exports.RegisterUser = async (req:Request, res:Response) => {
  
      const User = new UserModel(req.body);
      try {
            const UserExists = await UserModel.find({ phoneNumber: User.phoneNumber });
            if (UserExists.length) {
                  res.status(409).send('phone number is already registered');
            } else {
                  try {
                        await User.save();
                        res.status(201).send('user created');
                  } catch (error:any) {
                        res.status(500).send(error.message);
                  }
            }
      } catch (error:any) {
            res.status(400).send(error.message);
      }

}

// exports.Login = async (req:Request, res:Response) => {
//       const payload = req.body;
//       try {
//             const User = await UserModel.findOne({ phoneNumber:payload.phoneNumber });
//             if (User) {
//                  const isMatched = await User.comparePassword(payload.password,User.password);
//                  if(isMatched){
//                   const token = Authorization.Authorize(User?._doc);
//                   const response = {name:User.name,phoneNumber:User.phoneNumber,token}
//                   res.status(200).send(response)
//                  }else{
//                   res.status(401).send('invalid phone/password');
//                  }
//             }else{
//                   res.status(404).send('invalid phone');
//             }
//       } catch (error) {
//             res.status(404).send('invalid phone');
//       }

// }

exports.UpdateUser = async (req:Request, res:Response) => {
      const User = req.body;
      const userId = req.query.user
      try {
            const UpdateUser = await UserModel.findOneAndUpdate({_id:userId},User);
            if (UpdateUser) {
                  res.status(200).send('user updated');
            }else{
                  res.status(404).send('user not found');
            }
      } catch (error:any) {
            res.status(400).send(error.message);
      }

}

