import { model, Schema } from "mongoose";

export const UserModel = model(
  "User",
  new Schema({
    username: {
      type: String,
      required: [true, 'Username is required']
    },
    mobile: {
      unique: true,
      type: String,
      required: [true, 'Phone number is required'],
      minlength: [10, 'Phone number must be minimum 10 characters long.']
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'Email is required']
    },
    role: {
      type: String,
      default: 'user'
    },
    password: {
      type: String,
      required: [true, 'Password is required']
    },
    status: { type: String, default: 'pending' }
  })
);